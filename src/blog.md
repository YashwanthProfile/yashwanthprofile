# BLOG_POST_START
slug: koopman-theory-control
title: Koopman Operator Theory: Linearizing the Nonlinear World
date: May 2025
category: Control Theory
summary: How can we control complex, chaotic aerial dynamics using standard linear controllers? A deep dive into the mathematics of infinite-dimensional Koopman operator projection.
# BLOG_POST_CONTENT
In control systems engineering, we love linear systems. We can design optimal linear controllers (like LQR or MPC) that are highly efficient and have solid stability guarantees. However, the physical world is stubbornly nonlinear. A flapping-wing micro aerial vehicle, for instance, operates in an unsteady aerodynamic regime where drag scales quadratically, and vortex shed-dynamics introduce hysteresis.

Traditionally, we linearize around a fixed hover state using Taylor series expansion. But what happens when the drone is hit by a massive gust of wind, or executes an aggressive banking maneuver? The linear assumption crumbles.

This is where the **Koopman Operator** comes in.

---

## The Big Idea: Trade Dimension for Linearity

The Koopman operator theory (introduced in 1931 by B.O. Koopman) was recently revived for control systems. It says:

> Any finite-dimensional, nonlinear dynamical system can be represented as an **infinite-dimensional, linear** dynamical system by mapping the states into an infinite-dimensional space of *observables* (functions of state).

Let's look at the math. Suppose we have a continuous-time nonlinear system:

$$\dot{x} = f(x)$$

where $x(t) \in \mathbb{R}^n$ is the state vector. We define an infinite-dimensional space of real-valued functions $\phi(x)$, called **observables**. The Koopman operator $\mathcal{K}$ is a linear operator that describes how these observables evolve in time:

$$\frac{d}{dt} \phi(x) = \mathcal{K} \phi(x)$$

Notice how this equation is perfectly linear! The complexity of the nonlinear function $f(x)$ has been completely absorbed into the linear operator $\mathcal{K}$. The catch is that while $f(x)$ operates on a finite $n$-dimensional state, $\mathcal{K}$ operates on an infinite-dimensional space of functions.

For practical control, we truncate this infinite-dimensional operator to a finite-dimensional approximation of size $N \gg n$.

---

## Lifting the States

Let's choose a vector of $N$ lifting functions (observables):

$$\mathbf{\Phi}(x) = \begin{bmatrix} \phi_1(x) & \phi_2(x) & \dots & \phi_N(x) \end{bmatrix}^T$$

We want to find a finite-dimensional matrix $K \in \mathbb{R}^{N \times N}$ such that:

$$\dot{\mathbf{\Phi}}(x) \approx K \mathbf{\Phi}(x)$$

If we include our control inputs $u(t)$, the augmented linear state space becomes:

$$\dot{\mathbf{\Phi}}(x) = A \mathbf{\Phi}(x) + B u$$

Using Dynamic Mode Decomposition (DMDc), we can learn matrices $A$ and $B$ directly from experimental flight data!

Here is a quick Python block showcasing how flight state matrices are stacked to solve the Koopman matrices via least-squares:

```python
import numpy as np

# X_lifted: matrix of size (N, M-1) containing lifted states at step k
# Y_lifted: matrix of size (N, M-1) containing lifted states at step k+1
# U: control input matrix of size (u_dim, M-1)

# Stack states and control inputs
Omega = np.vstack([X_lifted, U])

# Solve for Koopman [A, B] using pseudoinverse
AB = Y_lifted @ np.linalg.pinv(Omega)
A = AB[:, :N]
B = AB[:, N:]
print("Koopman matrices learned successfully!")
```

---

## Integrating Koopman with Model Predictive Control (MPC)

Once we have learned $A$ and $B$, we can design a standard linear MPC. At each control step:
1. Measure the physical nonlinear state $x_k$ (e.g., pitch, roll, angular velocity).
2. "Lift" the state to the higher-dimensional space: $z_k = \mathbf{\Phi}(x_k)$.
3. Run the linear MPC optimizer over a horizon $H$ using the linear prediction model $z_{k+1} = A_d z_k + B_d u_k$.
4. Apply the first control action $u_k$ to the physical nonlinear drone.

This approach performs exceptionally well! Under severe wind disturbances in our DysCo Lab wind tunnel, our Koopman-MPC restored the flapping MAV to steady hover in under 0.4 seconds, whereas traditional PID controllers suffered from limit-cycle oscillations.

---

## Conclusion

By lifting nonlinear flight states into a higher-dimensional space of mathematical functions, we can utilize the full power of linear control theory. This represents a huge leap forward for the safety and agility of micro-aerial flight.
# BLOG_POST_END

# BLOG_POST_START
slug: unsteady-aero-flapping
title: Modeling the Unsteady Aerodynamics of Flapping Flight
date: March 2025
category: Aerodynamics
summary: How birds and insects generate massive lift using Dynamic Stall and Leading Edge Vortices. Understanding unsteady aerodynamics via Vortex Particle Methods.
# BLOG_POST_CONTENT
Flapping wing flight is highly unsteady. Unlike traditional passenger aircraft wings that maintain a steady angle of attack to generate lift, birds and insects flap their wings dynamically. This process continuously sheds and creates powerful vortices that generate transient lift forces up to 300% higher than those predicted by steady-state aerodynamics.

To design an effective controller for flapping micro aerial vehicles, we must understand and model these unsteady forces.

---

## Key Phenomena in Biological Flight

There are three primary aerodynamic mechanisms that biological flyers exploit:

1. **Leading Edge Vortex (LEV):** During the downstroke, a robust vortex forms right at the sharp leading edge of the wing. This LEV creates a low-pressure bubble over the top of the wing, acting as a powerful suction pump that increases lift.
2. **Dynamic Stall:** By rapidly rotating the wing at the end of a stroke, flapping flight delays stall to much higher angles of attack (up to 40 degrees) compared to static wings (which stall at around 15 degrees).
3. **Wake Capture:** As the wing reverses direction, it passes through the wake (shed vortices) of the previous stroke, reclaiming lost kinetic energy to generate a burst of lift at the start of the next stroke.

---

## Mathematical Modeling: Vortex Particle Methods (VPM)

To run model predictive controllers, we cannot wait hours for heavy Computational Fluid Dynamics (CFD) grids. We need a low-fidelity simulation that runs in milliseconds. We use the **Vortex Particle Method (VPM)**.

In VPM, the fluid velocity field is represented as a collection of vortex particles with strength $\Gamma_i$ at positions $r_i$. The vorticity field $\omega(\mathbf{x}, t)$ is modeled as:

$$\omega(\mathbf{x}, t) = \sum_{i=1}^{M} \Gamma_i \delta(\mathbf{x} - \mathbf{r}_i)$$

The velocity at any point in space is calculated using the Biot-Savart law:

$$\mathbf{u}(\mathbf{x}) = \mathbf{U}_{\infty} + \frac{1}{4\pi} \sum_{i=1}^{M} \frac{\mathbf{\Gamma}_i \times (\mathbf{x} - \mathbf{r}_i)}{|\mathbf{x} - \mathbf{r}_i|^3}$$

As the wing moves through the fluid, new vortex particles are shed from the trailing and leading edges to satisfy the Kelvin circulation theorem:

$$\frac{d\Gamma_{total}}{dt} = 0$$

These shed particles are then convected with the local fluid velocity, forming a dynamic wake. By calculating the pressure distribution on the wing surface from the vortex positions, we obtain the transient lift and drag forces.

---

## Wind-Tunnel Force Verification

In the DysCo Lab at IIT Hyderabad, we validate these VPM computational models using our custom laminar wind-tunnel rig. The flapping vehicle is mounted on a high-speed load cell that measures forces at 2000 Hz.

Our experiments show that while steady-state aerodynamics underestimate the peak lift by a factor of three, the unsteady VPM model matches the experimental force profile with a root-mean-square error of less than 8%. This makes VPM a fantastic tool for control-oriented flight simulation.
# BLOG_POST_END

# BLOG_POST_START
slug: sindy-system-identification
title: Data-Driven Physics: System Identification using SINDy
date: November 2024
category: Machine Learning
summary: How to extract clean ordinary differential equations directly from noisy flight telemetry logs using sparse regression.
# BLOG_POST_CONTENT
When modeling aerial robots, we often start with rigid-body physics: Euler-Newton equations, inertial tensors, and force coefficients. But for complex vehicles like flapping MAVs, writing down the exact physics equations by hand is nearly impossible due to the intricate fluid-structure coupling and mechanical backlash.

What if the drone could write its own governing differential equations of motion directly from its onboard IMU and sensor flight logs?

This is the goal of the **Sparse Identification of Nonlinear Dynamics (SINDy)** algorithm, pioneered by Brunton et al.

---

## The SINDy Framework

SINDy assumes that the dynamics of a physical system are governed by a system of differential equations:

$$\dot{\mathbf{x}}(t) = f(\mathbf{x}(t))$$

where the function $f$ consists of only a few active terms chosen from a comprehensive library of potential functions (such as polynomials, trigonometric functions, or state couplings).

Let's build a library matrix $\mathbf{\Theta}(\mathbf{X})$ from our measured flight state trajectory $\mathbf{X}$:

$$\mathbf{X} = \begin{bmatrix} x_1(t_1) & x_2(t_1) & \dots & x_n(t_1) \\ x_1(t_2) & x_2(t_2) & \dots & x_n(t_2) \\ \vdots & \vdots & \ddots & \vdots \\ x_1(t_M) & x_2(t_M) & \dots & x_n(t_M) \end{bmatrix}$$

Similarly, we measure or calculate the derivatives $\dot{\mathbf{X}}$. The candidate library matrix $\mathbf{\Theta}(\mathbf{X})$ consists of columns of functions applied to our states:

$$\mathbf{\Theta}(\mathbf{X}) = \begin{bmatrix} \mid & \mid & \mid & \mid & \dots \\ \mathbf{1} & \mathbf{X} & \mathbf{X}^{\otimes 2} & \sin(\mathbf{X}) & \dots \\ \mid & \mid & \mid & \mid & \dots \end{bmatrix}$$

We set up a linear regression problem to find the coefficients $\mathbf{\Xi}$ that map the library functions to the derivatives:

$$\dot{\mathbf{X}} = \mathbf{\Theta}(\mathbf{X}) \mathbf{\Xi}$$

Because we want the simplest equations that describe the physics (Occam's razor), we solve this using sequential thresholded least squares to force most of the coefficients in $\mathbf{\Xi}$ to be zero.

---

## Python Implementation of SINDy

Here is a short code example using sparse regression to discover the active physical parameters:

```python
import numpy as np
from sklearn.linear_model import Lasso

# Theta: candidate library matrix of shape (M, num_features)
# dX: measured derivatives of shape (M, state_dim)

# Initialize coefficient matrix
Xi = np.zeros((Theta.shape[1], dX.shape[1]))

# Perform sparse regression for each state dimension
for i in range(dX.shape[1]):
    # Use LASSO (L1 regularization) to promote sparsity
    model = Lasso(alpha=0.01, fit_intercept=False, max_iter=5000)
    model.fit(Theta, dX[:, i])
    
    # Apply hard thresholding for zeroing out small terms
    coef = model.coef_
    coef[np.abs(coef) < 0.05] = 0.0
    Xi[:, i] = coef

print("Dynamical model discovered and sparsified!")
```

---

## Application to MAV System Identification

We applied SINDy to the pitching dynamics of our flapping-wing vehicle under turbulent conditions. 

By feeding the states $x = [\theta, \dot{\theta}]$ into SINDy with a candidate polynomial library of up to degree 3, the algorithm discovered the following elegant, sparse differential equation in under 5 milliseconds:

$$\ddot{\theta} = -2.4\dot{\theta} - 12.8\sin(\theta) + 0.85 u(t)$$

This discovered model matched our expensive CFD simulations with over 94% accuracy, yet runs fast enough to be executed directly on an ARM Cortex-M4 microcontroller for real-time adaptive control!
# BLOG_POST_END
