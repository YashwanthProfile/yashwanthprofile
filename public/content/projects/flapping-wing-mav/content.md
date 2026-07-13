Flapping-wing micro aerial vehicles (MAVs) present superior maneuverability and hovering efficiency at small scales compared to traditional rotorcraft. However, generating controlled flight moments without adding heavy secondary control surfaces is a massive mechanical challenge. Our design modulates the core flapping stroke kinematics directly to achieve moments.

---

## Research Background

Flapping flight is inherently unstable, but bio-inspired kinematics offer unique solutions. Birds and insects do not have separate elevators, rudders, or ailerons. Instead, they twist their wings and modify the stroke trajectory dynamically. By designing a novel asymmetric six-bar linkage mechanism, we enable our MAV to change the wing's flapping stroke shape in real-time. This creates differential lift and thrust forces on either side, generating pitch, roll, and yaw torque directly from the primary propulsion system.

---

## Aerodynamic Simulation via Vortex Particle Methods (VPM)

To rapidly evaluate the generated lift and drag, we developed a low-fidelity **Vortex Particle Method (VPM)** simulation. This computationally efficient model simulates vortex shedding from moving boundaries, estimating unsteady aerodynamic coefficients in real-time.

In VPM, the fluid velocity field is represented as a collection of vortex particles with strength $\\Gamma_i$ at positions $r_i$:

$$\\omega(\\mathbf{x}, t) = \\sum_{i=1}^{M} \\Gamma_i \\delta(\\mathbf{x} - \\mathbf{r}_i)$$

Using the Biot-Savart law, we calculate the convective velocity at any point in space:

$$\\mathbf{u}(\\mathbf{x}) = \\mathbf{U}_{\\infty} + \\frac{1}{4\\pi} \\sum_{i=1}^{M} \\frac{\\mathbf{\\Gamma}_i \\times (\\mathbf{x} - \\mathbf{r}_i)}{|\\mathbf{x} - \\mathbf{r}_i|^3}$$

The results are used as a predictive observer inside our model-predictive control loop.

---

## Experimental Validation

We manufactured the mechanism using high-precision carbon-fiber plates and micro brushless servos. The physical MAV was mounted to a customized six-axis ATI Nano force sensor in a laminar wind tunnel.

The experimental results verified that asymmetric flapping amplitude changes generate sufficient directional moments to execute sharp banks and yaw adjustments. Under varying flow velocities up to 10 m/s, the force metrics aligned closely with our computational VPM model.