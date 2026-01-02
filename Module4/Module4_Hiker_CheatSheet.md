# Module 4 — Hiker’s Cheat Sheet (Rosetta Stone)

Use this table to translate between the **Hiker in the Fog** story and ML/DL technical terms.

| Technical Term | Hiker Analogy Component | Practical Meaning (So what?) |
|---|---|---|
| **Model** | The **Hiker** | A function that maps inputs to outputs. |
| **Weights (w)** | The hiker’s **internal dials** | Adjustable numbers that control how strongly inputs influence outputs. **Learning changes these.** |
| **Bias (b)** | An **offset** | Extra adjustable number that shifts predictions, increasing flexibility. |
| **Loss Function** | **Height** of the mountain | Numeric “how wrong?” score that training tries to reduce. |
| **Gradient** | **Slope** under the boot | Direction and steepness telling how to change weights to reduce loss. |
| **Learning Rate (α)** | **Step size** | How big each update is; too big overshoots, too small is slow. |
| **Optimizer** | The **walking strategy** | The algorithm that applies updates (e.g., gradient descent, Adam). |
| **Epoch** | One **full pass** of the trail | One full pass through training data. |
| **Convergence** | Reaching a **flat valley floor** | Loss stops improving significantly. |
| **Overfitting** | Memorizing one path perfectly | Great training results, poor new-data performance. |
| **Validation Set** | A **scout** checking another route | Detects overfitting during training. |
| **Local Minimum** | A **pothole** | “Good-enough” valley that isn’t the best overall. |
| **Activation Function** | “Should I signal?” decision | Non-linearity enabling complex patterns (e.g., ReLU, Sigmoid). |
| **Backpropagation** | Radio messages **uphill** | Sends gradient information backward so every hiker can adjust dials. |

## Key takeaways
- **Training vs Inference:** training moves and adjusts dials; inference stands still and reports location.
- **Nothing is learned except weights (and bias).**
- **Loss is the only feedback signal**; gradients provide direction.
