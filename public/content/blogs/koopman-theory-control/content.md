In control systems engineering, we love linear systems. We can design optimal linear controllers (like LQR or MPC) that are highly efficient and have solid stability guarantees. However, the physical world is stubbornly nonlinear. A flapping-wing micro aerial vehicle, for instance, operates in an unsteady aerodynamic regime where drag scales quadratically, and vortex shed-dynamics introduce hysteresis.

Traditionally, we linearize around a fixed hover state using Taylor series expansion. But what happens when the drone is hit by a massive gust of wind, or executes an aggressive banking maneuver? The linear assumption crumbles.

This is where the **Koopman Operator** comes in.

---

### The Big Idea: Trade Dimension for Linearity

The Koopman operator theory (introduced in 1931 by B.O. Koopman) was recently revived for control systems. It says:

> Any finite-dimensional, nonlinear dynamical system can be represented as an **infinite-dimensional, linear** dynamical system by mapping the states into an infinite-dimensional space of *observables* (functions of state).

Let's look at the math. Suppose we have a continuous-time nonlinear system:

$$\\dot{x} = f(x)$$

where $x(t) \\in \\mathbb{R}^n$ is the state vector. We define an infinite-dimensional space of real-valued functions $\\phi(x)$, called **observables**. The Koopman operator $\\mathcal{K}$ is a linear operator that describes how these observables evolve in time:

$$\\frac{d}{dt} \\phi(x) = \\mathcal{K} \\phi(x)$$

Notice how this equation is perfectly linear! The complexity of the nonlinear function $f(x)$ has been completely absorbed into the linear operator $\\mathcal{K}$. The catch is that while $f(x)$ operates on a finite $n$-dimensional state, $\\mathcal{K}$ operates on an infinite-dimensional space of functions.

For practical control, we truncate this infinite-dimensional operator to a finite-dimensional approximation of size $N \\gg n$.

---

### Lifting the States

Let's choose a vector of $N$ lifting functions (observables):

$$\\mathbf{\\Phi}(x) = \\begin{bmatrix} \\phi_1(x) & \\phi_2(x) & \\dots & \\phi_N(x) \\end{bmatrix}^T$$

We want to find a finite-dimensional matrix $K \\in \\mathbb{R}^{N \\times N}$ such that:

$$\\dot{\\mathbf{\\Phi}}(x) \\approx K \\mathbf{\\Phi}(x)$$

If we include our control inputs $u(t)$, the augmented linear state space becomes:

$$\\dot{\\mathbf{\\Phi}}(x) = A \\mathbf{\\Phi}(x) + B u$$

Using Dynamic Mode Decomposition (DMDc), we can learn matrices $A$ and $B$ directly from experimental flight data!

Here is a quick Python block showcasing how flight state matrices are stacked to solve the Koopman matrices via least-squares:

\`\`\`python
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
\`\`\`

---

### Integrating Koopman with Model Predictive Control (MPC)

Once we have learned $A$ and $B$, we can design a standard linear MPC. At each control step:
1. Measure the physical nonlinear state $x_k$ (e.g., pitch, roll, angular velocity).
2. "Lift" the state to the higher-dimensional space: $z_k = \\mathbf{\\Phi}(x_k)$.
3. Run the linear MPC optimizer over a horizon $H$ using the linear prediction model $z_{k+1} = A_d z_k + B_d u_k$.
4. Apply the first control action $u_k$ to the physical nonlinear drone.

This approach performs exceptionally well! Under severe wind disturbances in our DysCo Lab wind tunnel, our Koopman-MPC restored the flapping MAV to steady hover in under 0.4 seconds, whereas traditional PID controllers suffered from limit-cycle oscillations.

---

### Conclusion

By lifting nonlinear flight states into a higher-dimensional space of mathematical functions, we can utilize the full power of linear control theory. This represents a huge leap forward for the safety and agility of micro-aerial flight.