Flapping wing flight is highly unsteady. Unlike traditional passenger aircraft wings that maintain a steady angle of attack to generate lift, birds and insects flap their wings dynamically. This process continuously sheds and creates powerful vortices that generate transient lift forces up to 300% higher than those predicted by steady-state aerodynamics.

To design an effective controller for flapping micro aerial vehicles, we must understand and model these unsteady forces.

---

### Key Phenomena in Biological Flight

There are three primary aerodynamic mechanisms that biological flyers exploit:

1. **Leading Edge Vortex (LEV):** During the downstroke, a robust vortex forms right at the sharp leading edge of the wing. This LEV creates a low-pressure bubble over the top of the wing, acting as a powerful suction pump that increases lift.
2. **Dynamic Stall:** By rapidly rotating the wing at the end of a stroke, flapping flight delays stall to much higher angles of attack (up to 40 degrees) compared to static wings (which stall at around 15 degrees).
3. **Wake Capture:** As the wing reverses direction, it passes through the wake (shed vortices) of the previous stroke, reclaiming lost kinetic energy to generate a burst of lift at the start of the next stroke.

---

### Mathematical Modeling: Vortex Particle Methods (VPM)

To run model predictive controllers, we cannot wait hours for heavy Computational Fluid Dynamics (CFD) grids. We need a low-fidelity simulation that runs in milliseconds. We use the **Vortex Particle Method (VPM)**.

In VPM, the fluid velocity field is represented as a collection of vortex particles with strength $\\Gamma_i$ at positions $r_i$. The vorticity field $\\omega(\\mathbf{x}, t)$ is modeled as:

$$\\omega(\\mathbf{x}, t) = \\sum_{i=1}^{M} \\Gamma_i \\delta(\\mathbf{x} - \\mathbf{r}_i)$$

The velocity at any point in space is calculated using the Biot-Savart law:

$$\\mathbf{u}(\\mathbf{x}) = \\mathbf{U}_{\\infty} + \\frac{1}{4\\pi} \\sum_{i=1}^{M} \\frac{\\mathbf{\\Gamma}_i \\times (\\mathbf{x} - \\mathbf{r}_i)}{|\\mathbf{x} - \\mathbf{r}_i|^3}$$

As the wing moves through the fluid, new vortex particles are shed from the trailing and leading edges to satisfy the Kelvin circulation theorem:

$$\\frac{d\\Gamma_{total}}{dt} = 0$$

These shed particles are then convected with the local fluid velocity, forming a dynamic wake. By calculating the pressure distribution on the wing surface from the vortex positions, we obtain the transient lift and drag forces.

---

### Wind-Tunnel Force Verification

In the DysCo Lab at IIT Hyderabad, we validate these VPM computational models using our custom laminar wind-tunnel rig. The flapping vehicle is mounted on a high-speed load cell that measures forces at 2000 Hz.

Our experiments show that while steady-state aerodynamics underestimate the peak lift by a factor of three, the unsteady VPM model matches the experimental force profile with a root-mean-square error of less than 8%. This makes VPM a fantastic tool for control-oriented flight simulation.