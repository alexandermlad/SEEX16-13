import numpy as np

import astropy.units as u
from astropy import constants as const
from astropy.cosmology import Planck18 as cosmo

import emcee

import matplotlib.pyplot as plt

import corner

from IPython.display import display, Markdown

# Konstanter
H        = const.h.value
C        = const.c.value
K_B      = const.k_B.value
TCMB0    = cosmo.Tcmb0.value
M_SUN_KG = (1 * u.M_sun).to(u.kg).value

class Model():

    def __init__(self, z, kappa_star=(10.41 * u.cm**2 / u.g), nu_star=(1900  * u.GHz), n_walkers=64, n_steps=20000):
        self.z = z
        self.kappa_star = kappa_star.to(u.m**2 / u.kg).value
        self.nu_star = nu_star.to(u.Hz).value
        self.Tcmb_z = TCMB0 * (1 + z)
        self.g_z = ((1 + z) / (cosmo.luminosity_distance(z)**2)).to(u.m**-2).value

        self.n_walkers = n_walkers
        self.n_steps = n_steps

    @staticmethod
    def B(T, nu):
        return (2 * H * nu**3 / C**2) / (np.exp(H * nu / (K_B * T)) - 1.0)

    def SED(self, nu, T_d, beta_d, M_d):
        # Från ekv (12) i da Cunha et al. (2013)
        T_corrected = (T_d**(4 + beta_d) + TCMB0**(4 + beta_d) * ((1 + self.z)**(4 + beta_d) - 1))**(1 / (4 + beta_d))

        # Från ekv (8) i Sommovigo et al. (2021) som redan bakar in ekv (18) i da Cunha et al. (2013)
        kappa_nu = self.kappa_star * (nu / self.nu_star) ** beta_d
        flux = self.g_z * (M_SUN_KG * M_d) * kappa_nu * (self.B(T_corrected, nu) - self.B(self.Tcmb_z, nu))

        # Konvertera (W * m^-2 * Hz^-1) till Jy
        return flux * 1e26
    
    def __call__(self, lambdas_obs, fluxes, flux_errors):

        self.lambdas_obs = lambdas_obs.to(u.m).value
        self.fluxes      = fluxes.to(u.Jy).value
        self.flux_errors = flux_errors.to(u.Jy).value

        self.freqs       = C / self.lambdas_obs * (1 + self.z)
        self.lambdas     = self.lambdas_obs     / (1 + self.z)

        def log_prob(params):
            T_d, beta_d, M_d = params
            if not (10 < T_d < 100 and 0.2 < beta_d < 2.5 and 1e5 < M_d < 1e10):
                return -np.inf
            
            flux_model = self.SED(self.freqs, T_d, beta_d, M_d)
            residuals = (self.fluxes - flux_model) / self.flux_errors
            return -0.5 * np.sum(residuals**2)
        
        pos = [[np.random.normal(40.0, 5.0), np.random.normal(1.8, 0.2), 10**(np.random.normal(np.log10(1e7), 0.3))] for _ in range(self.n_walkers)]

        sampler = emcee.EnsembleSampler(self.n_walkers, 3, log_prob)
        sampler.run_mcmc(pos, self.n_steps, progress=True)

        self.flat_samples               = sampler.get_chain(discard=2000, thin=30, flat=True)
        self.T_d, self.beta_d, self.M_d = np.median(self.flat_samples, axis=0)

        self.T_d_error    = np.percentile(self.flat_samples[:, 0], [16, 84])
        self.beta_d_error = np.percentile(self.flat_samples[:, 1], [16, 84])
        self.M_d_error    = np.percentile(self.flat_samples[:, 2], [16, 84])
       
    def plot(self, fit_path="./fit", corner_path="./corner"):

        lambda_rest_grid = np.linspace(30, 300, 500) * u.um
        nu_rest_grid     = (C * u.m/u.s) / (lambda_rest_grid.to(u.m))

        n_draws = 1000
        idx = np.random.choice(len(self.flat_samples), size=n_draws, replace=False)

        flux_draws = np.empty((n_draws, len(nu_rest_grid)))
        for i, (Tdi, betai, Mdi) in enumerate(self.flat_samples[idx]):
            flux_draws[i] = self.SED(nu_rest_grid.value, Tdi, betai, Mdi)

        flux_med         = np.median(flux_draws, axis=0)
        flux_lo, flux_hi = np.percentile(flux_draws, [16, 84], axis=0)

        fig, ax = plt.subplots(figsize=(8,8))

        ax.fill_between(lambda_rest_grid.value,
                        flux_lo*1e6, flux_hi*1e6,
                        color='#efc9b8')

        ax.plot(lambda_rest_grid.value, flux_med*1e6,       
                color='#e75528', lw=2)

        ax.errorbar(self.lambdas*1e6, self.fluxes*1e6,    
                    yerr=self.flux_errors*1e6,
                    fmt='o', color='k')

        ax.set_xscale('log')
        ax.set_yscale('log')
        ax.set_xlabel('Restframe wavelength [μm]')
        ax.set_ylabel('Intrinsic flux density [μJy]')

        def um2mm(um):
            return um*( 1+ self.z)/1e3

        secax = ax.secondary_xaxis('top', functions=(um2mm, lambda x: x/(1 + self.z)*1e3))
        secax.set_xlabel('Observed wavelength [mm]')

        ax.set_xlim(lambda_rest_grid.value[0], lambda_rest_grid.value[-1])

        ax.set_xlabel('Restframe wavelength [μm]',    fontsize=24)
        ax.set_ylabel('Intrinsic flux density [μJy]', fontsize=24)
        secax.set_xlabel('Observed wavelength [mm]',  fontsize=24, labelpad=10)

        plt.tight_layout()
        plt.savefig(f"{fit_path}.pdf")
        plt.show()

        fig_corner = corner.corner(
            self.flat_samples,
            labels=[r"$T_d\,$[K]", r"$\beta_d$", r"$M_d\,$[$M_\odot$]"],
            truths=[self.T_d, self.beta_d, self.M_d],
            quantiles=[0.16, 0.5, 0.84],
            label_kwargs={"fontsize": 14},
            spacing=3
        )

        fig_corner.savefig(f"{corner_path}.pdf")
        plt.show()

    def print(self):

        parameters = [r"T_d \, [\mathrm{K}]", r"\beta_d", r"M_d \, [M_\odot]"]

        f=lambda x:r"{:.1e}".format(x).replace("e+0",r"\times10^{")+"}"if abs(x)>1e5 else str(int(x))if x==int(x)else f"{x:.2f}"

        means_fmt = [f(x) for x in [self.T_d, self.beta_d, self.M_d]]
        plus_fmt = [f(x) for x in [self.T_d_error[1], self.beta_d_error[1], self.M_d_error[1]]]
        minus_fmt = [f(x) for x in [self.T_d_error[0], self.beta_d_error[0], self.M_d_error[0]]]

        latex_table = r"\begin{array}{r|c|c|c}" + "\n"
        latex_table += r" & \text{Mean} & + & - \\" + "\n"
        latex_table += r"\hline" + "\n"
        for p, m, pl, mi in zip(parameters, means_fmt, plus_fmt, minus_fmt):
            latex_table += f"{p} & {m} & {pl} & {m} \\\\" + "\n"
        latex_table += r"\end{array}"

        display(Markdown(f"$$ {latex_table} $$"))