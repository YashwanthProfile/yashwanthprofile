We apply the infinite-dimensional Koopman operator theory to linearize complex, nonlinear aero-robotic systems into finite-dimensional linear state spaces. This allows robust and ultra-fast linear controller implementations on low-power onboard microcontrollers.

---

## The Koopman Operator Principle

Traditional control relies on linearizing around precise equilibria. For agile aerial maneuvering, this approach fails. The Koopman operator shifts the perspective: instead of looking at nonlinear states in a small region, we look at the evolution of infinite-dimensional linear observables.

Suppose we have a continuous-time nonlinear system:

$$\\dot{x} = f(x)$$

where $x(t) \\in \\mathbb{R}^n$ is the state vector. We define an infinite-dimensional space of real-valued functions $\\phi(x)$, called **observables**. The Koopman operator $\\mathcal{K}$ is a linear operator that describes how these observables evolve in time:

$$\\frac{d}{dt} \\phi(x) = \\mathcal{K} \\phi(x)$$

Notice how this equation is perfectly linear! The complexity of the nonlinear function $f(x)$ has been completely absorbed into the linear operator $\\mathcal{K}$.

---

## Control-Oriented DMD and System Identification

We choose a vector of $N$ lifting functions (observables):

$$\\mathbf{\\Phi}(x) = \\begin{bmatrix} \\phi_1(x) & \\phi_2(x) & \\dots & \\phi_N(x) \\end{bmatrix}^T$$

We want to find a finite-dimensional matrix $K \\in \\mathbb{R}^{N \\times N}$ such that:

$$\\dot{\\mathbf{\\Phi}}(x) \\approx K \\mathbf{\\Phi}(x)$$

If we include our control inputs $u(t)$, the augmented linear state space becomes:

$$\\dot{\\mathbf{\\Phi}}(x) = A \\mathbf{\\Phi}(x) + B u$$

Using Dynamic Mode Decomposition with Control (DMDc), we can learn matrices $A$ and $B$ directly from experimental flight data!

Here is a quick Python block showcasing how flight state matrices are stacked to solve the Koopman matrices via least-squares:

\`\`\`python
import numpy as np

# Stack states and control inputs
Omega = np.vstack([X_lifted, U])

# Solve for Koopman [A, B] using pseudoinverse
AB = Y_lifted @ np.linalg.pinv(Omega)
A = AB[:, :N]
B = AB[:, N:]
print("Koopman matrices learned successfully!")
\`\`\`

---

## Real-time Onboard Control Implementation

Once we have learned $A$ and $B$, we can design a standard linear MPC. At each control step:
1. Measure the physical nonlinear state $x_k$ (e.g., pitch, roll, angular velocity).
2. "Lift" the state to the higher-dimensional space: $z_k = \\mathbf{\\Phi}(x_k)$.
3. Run the linear MPC optimizer over a horizon $H$ using the linear prediction model $z_{k+1} = A_d z_k + B_d u_k$.
4. Apply the first control action $u_k$ to the physical nonlinear drone.

This approach performs exceptionally well! Under severe wind disturbances in our DysCo Lab wind tunnel, our Koopman-MPC restored the flapping MAV to steady hover in under 0.4 seconds, whereas traditional PID controllers suffered from limit-cycle oscillations.