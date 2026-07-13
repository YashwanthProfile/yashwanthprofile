When modeling aerial robots, we often start with rigid-body physics: Euler-Newton equations, inertial tensors, and force coefficients. But for complex vehicles like flapping MAVs, writing down the exact physics equations by hand is nearly impossible due to the intricate fluid-structure coupling and mechanical backlash.

What if the drone could write its own governing differential equations of motion directly from its onboard IMU and sensor flight logs?

This is the goal of the **Sparse Identification of Nonlinear Dynamics (SINDy)** algorithm, pioneered by Brunton et al.

---

### The SINDy Framework

SINDy assumes that the dynamics of a physical system are governed by a system of differential equations:

$$\\dot{\\mathbf{x}}(t) = f(\\mathbf{x}(t))$$

where the function $f$ consists of only a few active terms chosen from a comprehensive library of potential functions (such as polynomials, trigonometric functions, or state couplings).

Let's build a library matrix $\\mathbf{\\Theta}(\\mathbf{X})$ from our measured flight state trajectory $\\mathbf{X}$:

$$\\mathbf{X} = \\begin{bmatrix} x_1 & y_1 & z_1 \\\\ x_2 & y_2 & z_2 \\\\ \\vdots & \\vdots & \\vdots \\\\ x_m & y_m & z_m \\end{bmatrix}, \\quad \\dot{\\mathbf{X}} = \\begin{bmatrix} \\dot{x}_1 & \\dot{y}_1 & \\dot{z}_1 \\\\ \\dot{x}_2 & \\dot{y}_2 & \\dot{z}_2 \\\\ \\vdots & \\vdots & \\vdots \\\\ \\dot{x}_m & \\dot{y}_m & \\dot{z}_m \\end{bmatrix}$$

We construct the library $\\mathbf{\\Theta}(\\mathbf{X})$ containing columns of candidate terms:

$$\\mathbf{\\Theta}(\\mathbf{X}) = \\begin{bmatrix} | & | & | & | & | & | \\\\ \\mathbf{1} & \\mathbf{X} & \\mathbf{X}^{\\otimes 2} & \\sin(\\mathbf{X}) & \\cos(\\mathbf{X}) & \\dots \\\\ | & | & | & | & | & | \\end{bmatrix}$$

We want to find a sparse matrix of coefficients $\\mathbf{\\Xi}$ such that:

$$\\dot{\\mathbf{X}} = \\mathbf{\\Theta}(\\mathbf{X}) \\mathbf{\\Xi}$$

---

### Solving for Physics via Lasso Regression

Because we want our resulting equations to be simple and physically interpretable, most coefficients in $\\mathbf{\\Xi}$ should be zero. We solve this using a sequentially thresholded least-squares regression or Lasso ($L_1$ regularization) which penalizes complex, non-zero coefficients:

$$\\operatorname{argmin}_{\\mathbf{\\Xi}} \\| \\dot{\\mathbf{X}} - \\mathbf{\\Theta}(\\mathbf{X}) \\mathbf{\\Xi} \\|_2^2 + \\lambda \\| \\mathbf{\\Xi} \\|_1$$

By iteratively performing regression and setting small coefficients below a threshold $\\lambda$ to zero, the algorithm converges on the simplest mathematical model that fits the data.

---

### Flight Telemetry Results

We applied SINDy to the pitching rate $\\dot{q}$ of our flapping wing vehicle using flight telemetry data. Traditional machine learning models (like neural networks) can fit the data well, but they act as black boxes and are prone to overfitting.

SINDy, on the other hand, successfully discovered the underlying rigid-body aerodynamics:

$$\\dot{q} = -0.45 q - 1.28 q^3 + 2.15 u$$

This discovered equation reveals a beautiful cubic damping term (representing nonlinear aerodynamic drag) and a clean control input coefficient. Because we have discovered actual physics equations, the model generalizes perfectly to extreme hover angles where neural networks fail. SINDy provides a bridge between pure data-driven methods and physical interpretability.