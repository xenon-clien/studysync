const CTU_ETT_60_SECTIONS = [
  { name: 'Section A (1M x 10)', questionCount: '10 Questions (All Compulsory)', marksPerQuestion: '1 Mark each (10 Marks)', description: 'Objective / 1-line definitions, formulas, metrics & key properties.' },
  { name: 'Section B (2M x 5)', questionCount: '5 Questions (All Compulsory)', marksPerQuestion: '2 Marks each (10 Marks)', description: 'Short conceptual comparisons, equations, and quick numerical checks.' },
  { name: 'Section C (5M x 4)', questionCount: '4 Questions (Internal Choice)', marksPerQuestion: '5 Marks each (20 Marks)', description: 'MTT core topics expanded into derivations, confusion matrices, entropy & kernels.' },
  { name: 'Section D (10M x 2 of 3)', questionCount: '3 Given -> Attempt any 2', marksPerQuestion: '10 Marks each (20 Marks)', description: 'Full analytical problems: ID3 Decision Tree math, Naive Bayes, K-Means numericals & Backpropagation.' },
];

exports.EXTRA_CURATED_PACKS = [
  {
    university: 'CT University (Ludhiana) / AKTU / IKGPTU / DU',
    course: 'B.Tech CSE',
    semester: 'Sem 5',
    subject: 'Machine Learning',
    examType: 'End Term Test (ETT)',
    isGlobal: true,
    examPattern: {
      totalMarks: 60,
      duration: '3 Hours',
      passingMarks: '40% Overall (ETT 60 Marks + MTT/Internal 40 Marks)',
      sections: CTU_ETT_60_SECTIONS,
      highWeightageTopics: [
        'MTT -> ETT 5M: Supervised vs Unsupervised & Linear vs Logistic Regression + Gradient Descent',
        'MTT -> ETT 10M: Bias-Variance Tradeoff, Overfitting & L1 (Lasso) / L2 (Ridge) Regularization',
        'MTT -> ETT 10M: Decision Tree (ID3) Entropy & Information Gain Full Numerical',
        'ETT 10M: Support Vector Machine (SVM Margin, Support Vectors & Kernel Trick)',
        'ETT 10M: K-Means Clustering Numerical Iterations & PCA Dimensionality Reduction',
        'ETT 5M: Confusion Matrix Numerical (Accuracy, Precision, Recall, F1, ROC-AUC)',
        'ETT 5M: Random Forest (Bagging) vs Gradient Boosting / AdaBoost & Backpropagation',
      ],
    },
    crashSummary: {
      tagline: 'Zero-to-Exam Guide: Agar kuch bhi nahi padha, toh sirf ye 5 Units ki aasan kahani + formulas padh kar 45+/60 score karein!',
      passPlan: '1) Sabse pehle Unit 1 (Regression + Bias-Variance) aur Unit 5 (Confusion Matrix TP/FP/FN/TN numerical) pakka karein — ye 15-20 marks guaranteed dete hain. 2) Phir Unit 2 (Decision Tree Entropy formula & Naive Bayes) aur Unit 4 (K-Means distance table) dekhein — dono har ETT me 10-mark long me aate hain!',
      units: [
        {
          unit: 'Unit 1',
          title: 'ML Basics, Linear & Logistic Regression, Gradient Descent (Easy Intuition)',
          analogy: 'Socho aap exam me kitne ghante padhte ho (X) aur kitne marks aate hain (Y). Ek seedhi line (y = mx + c) kheench kar naye student ke marks predict karna hi Linear Regression hai!',
          simpleExplanation: 'Machine Learning me computer ko rules ratwane ke bajaye purana data (examples) dete hain aur woh khud pattern seekh leta hai.\n• Supervised Learning: Teacher/Answer key saath hai (Labels given — Regression continuous numbers ke liye jaise House Price, Classification categories ke liye jaise Spam/Not Spam).\n• Linear Regression line y = w*x + b banata hai aur MSE (Mean Squared Error) kam karta hai.\n• Gradient Descent ek pahad se neeche utarne jaisa hai: har step par error ki slope dekh kar weights thoda-thoda adjust karo jab tak lowest valley (minimum loss) na mil jaye.\n• Logistic Regression naam me "regression" hai par kaam Classification (0 ya 1 probability) ka karta hai — Sigmoid function 1/(1+e^-z) kisi bhi number ko 0..1 probability me badal deta hai.',
          keyFormulasOrKeywords: [
            'Linear Hypothesis: y_hat = w*x + b  |  MSE Loss = (1/n) * sum(y - y_hat)^2',
            'Gradient Descent Update: w_new = w_old - alpha * (dLoss / dw)  [alpha = Learning Rate]',
            'Sigmoid (Logistic): sigma(z) = 1 / (1 + e^-z) -> Output in (0, 1)',
            'Overfitting Fix = More Data + Cross-Validation + L1 (Lasso) / L2 (Ridge) Regularization',
          ],
        },
        {
          unit: 'Unit 2',
          title: 'Decision Trees (ID3), Naive Bayes & KNN (20-Questions Game)',
          analogy: 'Decision Tree bilkul "Guess Who?" ya 20-Questions game jaisa hai: "Kya mausam Sunny hai? -> Haan -> Kya Humidity High hai? -> Haan -> Cricket Mat Khelo!"',
          simpleExplanation: '• Decision Tree har step par sabse accha feature chunta hai jo data ko cleanest groups me baante. Best feature chunne ke liye Entropy (kaha kitna confusion/disorder hai) aur Information Gain (split ke baad confusion kitna ghata) nikalte hain — jis feature ka Information Gain sabse zyada, woh Root Node banta hai!\n• Naive Bayes Bayes Theorem P(Class|Features) use karta hai aur "Naive" maanta hai ki saare features ek doosre se independent hain (Email spam detection me super fast!).\n• KNN (K-Nearest Neighbors): "Jaisi sangat waisi rangat" — naye point ke sabse kareeb K neighbors (Euclidean distance) dekho, aur majority vote se class decide karo.',
          keyFormulasOrKeywords: [
            'Entropy H(S) = -p(+) log2 p(+) - p(-) log2 p(-)  [Pure=0, 50-50 split=1]',
            'Information Gain IG(S, A) = H(S) - sum((|Sv|/|S|) * H(Sv))',
            'Bayes Rule: P(Y|X) = [P(X|Y) * P(Y)] / P(X)',
            'Euclidean Distance: sqrt((x2-x1)^2 + (y2-y1)^2)',
          ],
        },
        {
          unit: 'Unit 3',
          title: 'SVM, Kernel Trick & Neural Networks (ANN / Backpropagation)',
          analogy: 'SVM ek road banane jaisa hai do colonies (Red vs Blue points) ke beech — hum chahte hain road (Margin) itni chaudi ho ki dono side ke sabse kareebi ghar (Support Vectors) door rahein!',
          simpleExplanation: '• SVM (Support Vector Machine): Aisi boundary (Hyperplane) dhoondhta hai jo dono classes ke beech Maximum Margin rakhe. Jo points bilkul boundary par tikte hain unhe Support Vectors kehte hain.\n• Kernel Trick: Agar 2D paper par ek seedhi line Red aur Blue ko alag nahi kar pa rahi, toh Kernel usse 3D space me utha deta hai jahan ek flat sheet unhe easily separate kar sake (RBF, Polynomial).\n• Neural Network (ANN): Human brain ke neurons ki copy — Input Layer -> Hidden Layers (weighted sum + Activation like ReLU/Sigmoid) -> Output Layer. Backpropagation output ki galti ko peeche bhej kar har weight ko sudharta hai.',
          keyFormulasOrKeywords: [
            'SVM Margin Width = 2 / ||w||  (Maximize margin = Minimize ||w||)',
            'Perceptron Output: y = f(sum(w_i * x_i) + bias)',
            'ReLU Activation: f(x) = max(0, x)  [Vanishing gradient rokt hai]',
            'Backpropagation = Chain Rule se error gradients output se input layer tak propagate karna',
          ],
        },
        {
          unit: 'Unit 4',
          title: 'Unsupervised Learning: K-Means Clustering & PCA',
          analogy: 'Socho ek basket me bina label ke mixed fruits pade hain — color aur size dekh kar unhe 3 alag piles (clusters) me baantna hi Unsupervised Clustering hai!',
          simpleExplanation: '• Unsupervised Learning me koi answer label (Y) nahi hota — model khud structure/groups dhoondhta hai.\n• K-Means Algorithm (4 aasan steps): (1) K random centroids choose karo -> (2) Har point ko sabse kareebi centroid wale group me daalo -> (3) Har group ka naya average (mean) centroid nikalo -> (4) Repeat jab tak centroids hilna band na kar dein!\n• Elbow Method batata hai best K kya hoga (WCSS vs K graph).\n• PCA (Principal Component Analysis): Agar data me 50 columns hain toh use 2-3 most informative directions (Eigenvectors with highest Variance) me compress kar deta hai.',
          keyFormulasOrKeywords: [
            'K-Means Objective: Minimize WCSS (Within-Cluster Sum of Squares)',
            'Steps: Pick K -> Assign nearest centroid -> Recompute mean -> Repeat till convergence',
            'PCA Steps: Standardize Data -> Covariance Matrix -> Eigenvalues/Eigenvectors -> Pick Top k Components',
          ],
        },
        {
          unit: 'Unit 5',
          title: 'Ensemble Learning (Random Forest / Boosting) & Evaluation Metrics',
          analogy: 'Ek doctor ki jagah 100 doctors ke panel (Random Forest) se poochhna zyada accurate hota hai — yahi Ensemble Learning ("Wisdom of Crowd") hai!',
          simpleExplanation: '• Bagging (Random Forest): Data ke alag random samples bana kar parallel me bohot saare Decision Trees train karo aur majority vote lo -> Variance (Overfitting) kam hota hai.\n• Boosting (AdaBoost / XGBoost): Sequential trees banao jahan har naya tree pichhle tree ki galtiyon (high-weight misclassified points) par zyada dhyan de -> Bias kam hota hai.\n• Confusion Matrix ke 4 boxes: TP (Sahi Positive), TN (Sahi Negative), FP (False Alarm), FN (Miss ho gaya). Exam me har baar TP/FP/FN/TN se Precision, Recall, F1 nikalne ko aata hai!',
          keyFormulasOrKeywords: [
            'Accuracy = (TP + TN) / Total',
            'Precision = TP / (TP + FP)  [Predicted Positive me kitne sahi]',
            'Recall (Sensitivity) = TP / (TP + FN)  [Actual Positive me kitne pakde]',
            'F1-Score = 2 * Precision * Recall / (Precision + Recall)',
          ],
        },
      ],
    },
    notes: [
      {
        unit: 'Unit 1',
        title: 'Introduction to ML, Regression & Gradient Descent',
        summary: 'Machine Learning learns mapping functions from experience E with respect to task T and performance P (Tom Mitchell). Supervised learning covers Regression (Linear, Polynomial, Ridge/Lasso) and Classification (Logistic Regression via Sigmoid + Binary Cross-Entropy Log Loss). Gradient Descent optimizes parameters iteratively using learning rate alpha; Feature Scaling (Normalization/Standardization) speeds up convergence.',
        keyPoints: [
          'Linear Regression Closed-Form (Normal Equation): theta = (X^T X)^-1 X^T y; Iterative: Batch/Stochastic/Mini-Batch GD.',
          'Regularization adds penalty to loss: Ridge (L2 = lambda * sum(w^2)) shrinks weights smoothly; Lasso (L1 = lambda * sum(|w|)) drives sparse zeros for feature selection.',
          'Bias-Variance Tradeoff: Total Error = Bias^2 + Variance + Irreducible Noise.',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Decision Trees (ID3/CART), Naive Bayes & KNN',
        summary: 'ID3 selects splitting attribute maximizing Information Gain (reduction in Shannon Entropy); CART uses Gini Impurity (1 - sum(p_i^2)). Naive Bayes applies Bayes Theorem assuming conditional independence of features given class (Laplace smoothing avoids zero-probability traps). KNN is lazy non-parametric learning classifying via majority vote among K nearest neighbors.',
        keyPoints: [
          'Entropy is 0 when pure, max 1.0 when 50-50 binary split.',
          'Tree Pruning (Pre-pruning max_depth / Post-pruning) prevents Decision Tree overfitting.',
          'Small K in KNN -> noisy/high variance; Large K -> smooth boundary/high bias (always pick odd K for binary classes).',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Support Vector Machines (SVM), Kernel Trick & Neural Networks',
        summary: 'SVM finds the optimal separating hyperplane maximizing geometric margin 2/||w|| between classes, determined purely by boundary Support Vectors (Hard Margin vs Soft Margin with slack variable C). Kernels (Linear, Polynomial, RBF/Gaussian) compute inner products in high-dimensional spaces implicitly. Multilayer Perceptrons train weights via Forward Pass + Backpropagation using Chain Rule and non-linear activations (ReLU, Sigmoid, Tanh).',
        keyPoints: [
          'Large C in SVM penalizes margin violations heavily (risk overfitting); small C allows wider softer margin.',
          'RBF Kernel: K(x, x\') = exp(-gamma * ||x - x\'||^2).',
          'Activation functions introduce non-linearity so stacked layers don\'t collapse into single linear regression.',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'Unsupervised Learning: K-Means, Hierarchical Clustering & PCA',
        summary: 'K-Means partitions unlabeled data into K clusters minimizing Within-Cluster Sum of Squares (WCSS), sensitive to initialization (improved by K-Means++). Hierarchical Clustering builds a Dendrogram via Agglomerative (bottom-up Single/Complete/Average linkage) or Divisive merging. PCA projects correlated features onto orthogonal Principal Components ordered by largest Eigenvalues of the Covariance Matrix.',
        keyPoints: [
          'K-Means requires K upfront and assumes spherical equal-size clusters; DBSCAN discovers arbitrary shapes & outliers.',
          'PCA maximizes variance retained along eigenvectors of standardized Covariance matrix.',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'Ensemble Methods (Bagging/Boosting) & Model Evaluation',
        summary: 'Bagging trains independent models on bootstrap samples in parallel and averages/votes (Random Forest adds random feature subsampling at each split to decorrelate trees). Boosting trains weak learners sequentially emphasizing previously misclassified samples (AdaBoost updates sample weights; Gradient Boosting fits residual errors). Cross-validation (k-Fold) reliably estimates generalization accuracy.',
        keyPoints: [
          'Bagging reduces Variance (overfitting); Boosting reduces Bias (underfitting).',
          'ROC Curve plots TPR (Recall) vs FPR across classification thresholds; AUC near 1.0 indicates strong discrimination.',
        ],
      },
    ],
    pyqs: [
      // Section A: 10 x 1 Mark
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 1', frequency: 'MTT + ETT 1M', isImportant: true, question: 'State Tom Mitchell\'s formal definition of Machine Learning.', answer: 'A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E.', examTip: 'Mention the 3 letters T, E, P clearly.' },
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 1', frequency: 'MTT + ETT 1M', isImportant: true, question: 'Which activation function does Logistic Regression use and what is its range?', answer: 'Sigmoid (Logistic) function: 1 / (1 + e^-z), mapping any real number into (0, 1).', examTip: 'Threshold 0.5 classifies into 0 or 1.' },
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 1', frequency: 'MTT 1M', isImportant: true, question: 'What happens in Gradient Descent if the Learning Rate alpha is too large?', answer: 'Parameters overshoot the minimum repeatedly, causing loss to oscillate or diverge instead of converging.', examTip: 'Too small alpha = very slow convergence.' },
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 2', frequency: 'ETT 1M', isImportant: true, question: 'What is the maximum and minimum possible Entropy H(S) for a binary classification dataset?', answer: 'Minimum = 0 (completely pure, all same class); Maximum = 1 (50%-50% split).', examTip: 'Log base 2 gives max 1 for 2 classes.' },
      { year: 2024, marks: 1, section: 'Section A', unit: 'Unit 2', frequency: 'ETT 1M', isImportant: true, question: 'Why is KNN called a "Lazy Learner"?', answer: 'It performs zero model training upfront and memorizes the training dataset, computing distances only at prediction/test time.', examTip: 'Eager learners = Decision Tree/SVM; Lazy = KNN.' },
      { year: 2024, marks: 1, section: 'Section A', unit: 'Unit 3', frequency: 'ETT 1M', isImportant: true, question: 'What are Support Vectors in SVM?', answer: 'The closest training data points from both classes that lie directly on the margin boundaries and determine the position of the optimal hyperplane.', examTip: 'Removing other points does not change hyperplane.' },
      { year: 2024, marks: 1, section: 'Section A', unit: 'Unit 4', frequency: 'ETT 1M', isImportant: true, question: 'Which method is commonly used to choose the optimal number of clusters K in K-Means?', answer: 'The Elbow Method (plotting WCSS vs K and picking the "elbow" bend point) or Silhouette Score.', examTip: 'WCSS always decreases as K grows.' },
      { year: 2024, marks: 1, section: 'Section A', unit: 'Unit 4', frequency: 'ETT 1M', isImportant: true, question: 'What is the main purpose of PCA (Principal Component Analysis)?', answer: 'Unsupervised dimensionality reduction that transforms correlated features into fewer uncorrelated orthogonal components preserving maximum variance.', examTip: 'Mention Covariance Matrix & Eigenvectors.' },
      { year: 2023, marks: 1, section: 'Section A', unit: 'Unit 5', frequency: 'ETT 1M', isImportant: true, question: 'Why is Accuracy misleading on imbalanced datasets (e.g. 99% non-fraud, 1% fraud)?', answer: 'Predicting all samples as majority class gives 99% accuracy while detecting 0% fraud (Recall = 0). Use Precision, Recall, and F1-Score instead.', examTip: 'Classic ETT 1-mark viva question!' },
      { year: 2023, marks: 1, section: 'Section A', unit: 'Unit 5', frequency: 'ETT 1M', isImportant: true, question: 'What is Bootstrap sampling in Bagging (Random Forest)?', answer: 'Drawing multiple random subsets of the same size N from the training data WITH replacement (~63.2% unique samples per tree).', examTip: 'Remaining ~36.8% form Out-Of-Bag (OOB) validation set.' },

      // Section B: 5 x 2 Marks
      { year: 2025, marks: 2, section: 'Section B', unit: 'Unit 1', frequency: 'MTT + ETT 2M', isImportant: true, question: 'Differentiate between Supervised, Unsupervised, and Reinforcement Learning with one example each.', answer: 'Supervised: Labeled pairs (X, Y) -> House Price Prediction / Spam Detection.\nUnsupervised: Unlabeled X -> Customer Segmentation (K-Means).\nReinforcement: Agent learns actions via Rewards/Penalties -> Game AI / Robotics.', examTip: '3-row comparison gets full 2 marks.' },
      { year: 2025, marks: 2, section: 'Section B', unit: 'Unit 1', frequency: 'MTT + ETT 2M', isImportant: true, question: 'Distinguish L1 (Lasso) vs L2 (Ridge) Regularization.', answer: 'L2 adds lambda * sum(w_i^2): shrinks all weights smoothly near zero (handles collinearity).\nL1 adds lambda * sum(|w_i|): forces weak feature weights to exact ZERO, performing automatic feature selection.', examTip: 'State penalty formulas.' },
      { year: 2024, marks: 2, section: 'Section B', unit: 'Unit 2', frequency: 'ETT 2M', isImportant: true, question: 'Why is Naive Bayes called "Naive" and what is Laplace Smoothing?', answer: 'Called "Naive" because it assumes all input features are conditionally independent given the target class.\nLaplace Smoothing adds +1 to numerator counts so an unseen word never multiplies total probability to zero.', examTip: 'Mention P = (count + 1) / (N + |V|).' },
      { year: 2024, marks: 2, section: 'Section B', unit: 'Unit 5', frequency: 'ETT 2M (Repeated 4x)', isImportant: true, question: 'Given Confusion Matrix TP=45, FP=5, FN=10, TN=40, compute Accuracy, Precision, Recall, and F1-Score.', answer: 'Total = 100.\nAccuracy = (45+40)/100 = 85%.\nPrecision = 45/(45+5) = 0.90.\nRecall = 45/(45+10) = 45/55 = 0.818.\nF1 = 2*(0.90*0.818)/(0.90+0.818) = 0.857.', examTip: 'Always show formulas before plugging numbers.' },
      { year: 2023, marks: 2, section: 'Section B', unit: 'Unit 3', frequency: 'ETT 2M', isImportant: true, question: 'Why do Neural Networks need non-linear activation functions like ReLU instead of linear layers?', answer: 'Composition of linear functions is still just a single linear equation (W2(W1*x) = W*x), so without non-linearity a deep network could never learn XOR or curved decision boundaries.', examTip: 'Give the classic XOR counterexample.' },

      // Section C: 4 x 5 Marks
      { year: 2025, marks: 5, section: 'Section C', unit: 'Unit 1', frequency: 'MTT Core -> ETT 5M', isImportant: true, question: 'Explain Overfitting, Underfitting, and the Bias-Variance Tradeoff with curves and 4 prevention techniques.', answer: 'Underfitting (High Bias): Model too simple, fails both train & test data.\nOverfitting (High Variance): Model memorizes training noise, high train accuracy but poor test accuracy.\nBias-Variance Tradeoff: Error = Bias^2 + Variance + Noise; optimal complexity minimizes total U-shaped validation error.\nFixes: (1) Cross-Validation, (2) L1/L2 Regularization, (3) Pruning / Early Stopping, (4) More Training Data / Dropout.', examTip: 'Draw U-shaped validation error vs model complexity graph!' },
      { year: 2025, marks: 5, section: 'Section C', unit: 'Unit 1', frequency: 'MTT Core -> ETT 5M', isImportant: true, question: 'Derive the Gradient Descent weight update rule for Simple Linear Regression y_hat = w*x + b minimizing MSE.', answer: 'Cost J(w, b) = (1 / 2n) * sum_{i=1..n} (y_hat_i - y_i)^2.\nPartial derivatives:\ndJ/dw = (1/n) * sum (w*x_i + b - y_i) * x_i\ndJ/db = (1/n) * sum (w*x_i + b - y_i)\nUpdate rules at each iteration:\nw := w - alpha * (dJ/dw)\nb := b - alpha * (dJ/db)\nCompare Batch GD (full dataset), Stochastic GD (1 sample), Mini-Batch GD (b samples).', examTip: 'Using 1/(2n) cancels cleanly with the square derivative 2.' },
      { year: 2024, marks: 5, section: 'Section C', unit: 'Unit 3', frequency: 'ETT 5M (Repeated 4x)', isImportant: true, question: 'Explain Support Vector Machine (SVM) hyperplane, Maximum Margin, and the Kernel Trick for non-linear data.', answer: 'SVM separates classes using w^T x + b = 0, bounding margin lines w^T x + b = +1 and -1 with margin width 2 / ||w||.\nOptimization: Minimize (1/2)||w||^2 subject to y_i(w^T x_i + b) >= 1 (soft margin adds C * sum(slack_i)).\nKernel Trick: Maps non-linearly separable data to higher dimension using K(x, z) = phi(x).phi(z) without explicitly computing phi(x): Linear, Polynomial (x^T z + c)^d, RBF exp(-gamma||x-z||^2).', examTip: 'Show concentric circle 2D -> 3D parabola projection sketch.' },
      { year: 2024, marks: 5, section: 'Section C', unit: 'Unit 5', frequency: 'ETT 5M (Repeated 4x)', isImportant: true, question: 'Compare Bagging (Random Forest) vs Boosting (AdaBoost / Gradient Boosting) on architecture, bias/variance impact, and overfitting resistance.', answer: 'Bagging (Parallel): Trains independent trees on bootstrap samples + random feature subsets (Random Forest); combines via voting/averaging; reduces VARIANCE & prevents overfitting.\nBoosting (Sequential): Each new weak tree focuses on previous errors/weights (AdaBoost) or negative gradient residuals (GBM/XGBoost); weighted sum; reduces BIAS & achieves top accuracy (can overfit if too many estimators).', examTip: 'Use a clear 5-point comparison table.' },

      // Section D: 3 x 10 Marks (Attempt 2 of 3 in CTU ETT)
      { year: 2025, marks: 10, section: 'Section D', unit: 'Unit 2', frequency: 'ETT 10M (Repeated 5x)', isImportant: true, question: 'Explain the ID3 Decision Tree algorithm (Entropy & Information Gain) and compute which root attribute to split first: Dataset has 14 days (9 Play=Yes, 5 Play=No); Outlook splits into Sunny (2 Yes, 3 No), Overcast (4 Yes, 0 No), Rainy (3 Yes, 2 No).', answer: '1. Parent Entropy H(S) = -(9/14)log2(9/14) - (5/14)log2(5/14) = 0.940 bits.\n2. Subset Entropies for Outlook:\n   - H(Sunny) = -(2/5)log2(2/5) - (3/5)log2(3/5) = 0.971\n   - H(Overcast) = -(4/4)log2(4/4) - 0 = 0.000 (Pure!)\n   - H(Rainy) = -(3/5)log2(3/5) - (2/5)log2(2/5) = 0.971\n3. Weighted Conditional Entropy:\n   H(S | Outlook) = (5/14)*0.971 + (4/14)*0 + (5/14)*0.971 = 0.694 bits.\n4. Information Gain(S, Outlook) = 0.940 - 0.694 = 0.246 bits.\n(Similarly compare Temp/Humidity/Wind; Outlook has highest IG -> becomes Root Node, with Overcast leaf = Play Yes).', examTip: 'Memorize H(9,5)=0.940 and H(3,2)=0.971 — exact classic PlayTennis dataset used in 80% of university ML exams!' },
      { year: 2025, marks: 10, section: 'Section D', unit: 'Unit 4', frequency: 'ETT 10M (Repeated 5x)', isImportant: true, question: 'Explain K-Means Clustering algorithm and apply 2 iterations on points A(2,10), B(2,5), C(8,4), D(5,8), E(7,5), F(6,4), G(1,2), H(4,9) with initial K=3 centroids C1=A(2,10), C2=D(5,8), C3=G(1,2). Also outline PCA steps.', answer: 'Iteration 1 (Euclidean Distance squared to C1(2,10), C2(5,8), C3(1,2)):\n- A(2,10): nearest C1\n- B(2,5): d(C1)=25, d(C2)=18, d(C3)=10 -> C3\n- C(8,4): d(C2)=25 vs C1=72, C3=53 -> C2\n- D(5,8): C2 | E(7,5): d(C2)=13 -> C2 | F(6,4): d(C2)=17 -> C2\n- G(1,2): C3 | H(4,9): d(C2)=2 vs d(C1)=5 -> C2.\nClusters after Iter 1: Cluster 1={A}, Cluster 2={C,D,E,F,H}, Cluster 3={B,G}.\nNew Centroids:\n- C1_new = (2, 10)\n- C2_new = ((8+5+7+6+4)/5, (4+8+5+4+9)/5) = (6, 6)\n- C3_new = ((2+1)/2, (5+2)/2) = (1.5, 3.5).\nIteration 2 reassigns H(4,9) closer to C1(2,10) (d^2=5) than C2(6,6) (d^2=13) and B(2,5) stays C3 -> update means till convergence.\nPCA Steps: Standardize features -> Compute Covariance Matrix Sigma -> Compute Eigenvalues/Eigenvectors -> Select Top-k Eigenvectors -> Project Z = X * W.', examTip: 'Comparing squared Euclidean distance d^2 saves square-root calculations and avoids rounding errors!' },
      { year: 2024, marks: 10, section: 'Section D', unit: 'Unit 2', frequency: 'ETT 10M (4x)', isImportant: true, question: '(a) Apply Naive Bayes Classifier to predict Play=Yes/No for test sample X = (Outlook=Sunny, Temp=Cool, Humidity=High, Wind=Strong) given priors P(Yes)=9/14, P(No)=5/14 and conditional probabilities. (b) Explain Multilayer Perceptron Backpropagation steps.', answer: '(a) Naive Bayes Posterior Likelihoods:\n- P(Yes | X) proportional to P(Yes) * P(Sunny|Yes) * P(Cool|Yes) * P(High|Yes) * P(Strong|Yes)\n  = (9/14) * (2/9) * (3/9) * (3/9) * (3/9) = 0.0053\n- P(No | X) proportional to P(No) * P(Sunny|No) * P(Cool|No) * P(High|No) * P(Strong|No)\n  = (5/14) * (3/5) * (1/5) * (4/5) * (3/5) = 0.0206\nSince 0.0206 > 0.0053, prediction is Play = NO (Normalized P(No) = 0.0206 / (0.0206+0.0053) ≈ 79.5%).\n(b) Backpropagation:\n1. Forward pass computes activations a = f(W*x + b) layer by layer and calculates loss L(y, y_hat).\n2. Backward pass computes output error delta_L = dL/dz_L and propagates gradients delta_l = (W_{l+1}^T delta_{l+1}) * f\'(z_l) using Chain Rule.\n3. Update weights W := W - alpha * (delta * a_prev^T).', examTip: 'Write "Normalizing evidence P(X) = P(X|Yes)P(Yes) + P(X|No)P(No)" for full marks!' },
    ],
  },
  {
    university: 'CT University (Ludhiana) / AKTU / IKGPTU',
    course: 'B.Tech CSE',
    semester: 'Sem 5',
    subject: 'Compiler Design',
    examType: 'End Term Test (ETT)',
    isGlobal: true,
    examPattern: {
      totalMarks: 60,
      duration: '3 Hours',
      passingMarks: '40% Overall',
      sections: CTU_ETT_60_SECTIONS,
      highWeightageTopics: [
        'MTT -> ETT 5M: 6 Phases of Compiler with Sample Input Trace',
        'MTT -> ETT 10M: Left Recursion Removal, Left Factoring, FIRST & FOLLOW Sets + LL(1) Parsing Table',
        'ETT 10M: Shift-Reduce, Operator Precedence & LR(0)/SLR(1) Parsing',
        'ETT 5M: Three-Address Code (Quadruples, Triples, Indirect Triples)',
        'ETT 5M: Basic Blocks, DAG & Peephole / Loop Optimization',
      ],
    },
    crashSummary: {
      tagline: 'Zero-to-Exam Compiler Design Summary: 6 Phases + FIRST/FOLLOW + 3-Address Code = Guaranteed Pass!',
      passPlan: '1) 6 Phases diagram + example (`x = a + b * 10`) yaad karo (10M/5M pakka aata hai). 2) Left Recursion hatane ka rule aur FIRST/FOLLOW nikalna seekh lo (Section D 10M guaranteed). 3) Quadruples/Triples (Three-Address Code) sabse easy 5-mark numerical hai!',
      units: [
        {
          unit: 'Unit 1',
          title: '6 Phases of Compiler & Lexical Analysis (Scanner)',
          analogy: 'Compiler ek factory assembly line hai: pehle words check hote hain (Lexical), phir grammar (Syntax), phir meaning/types (Semantic), phir intermediate blueprint (ICG), phir polish (Optimization), aur finally machine code!',
          simpleExplanation: 'Lexical Analyzer source code ko Tokens (Keywords, Identifiers, Operators) me todta hai aur comments/spaces hata kar Symbol Table update karta hai. Syntax Analyzer Parse Tree banata hai. Semantic Analyzer type checking karta hai (e.g. int + string error). Intermediate Code Generator Three-Address Code banata hai.',
          keyFormulasOrKeywords: [
            '6 Phases: Lexical -> Syntax -> Semantic -> ICG -> Code Optimizer -> Target Code Gen',
            'Lexeme = actual text ("count"); Token = <ID, pointer>; Pattern = Regex rule',
            'Left Recursion A -> A*alpha | beta converts to A -> beta*A\' and A\' -> alpha*A\' | epsilon',
          ],
        },
        {
          unit: 'Unit 2',
          title: 'Top-Down (LL1) vs Bottom-Up (SLR/LALR) Parsing',
          analogy: 'Top-Down root se leaves tak tree banata hai (Start symbol se string); Bottom-Up leaves ko fold (Reduce) karke root tak pahunchta hai!',
          simpleExplanation: 'LL(1) parser bina backtracking ke chalta hai jab grammar left-recursion aur ambiguity se free ho — iske liye FIRST(X) aur FOLLOW(A) sets nikal kar Parsing Table bharte hain. Bottom-Up Shift-Reduce parser stack me symbols Shift karta hai aur right-hand pattern dikhte hi Reduce karta hai (LR(0), SLR(1), LALR(1), CLR(1)).',
          keyFormulasOrKeywords: [
            'Power order: LR(0) < SLR(1) < LALR(1) < CLR(1)',
            'Conflicts: Shift-Reduce (SR) and Reduce-Reduce (RR)',
            '$ always goes in FOLLOW(StartSymbol)',
          ],
        },
        {
          unit: 'Unit 3 & 4',
          title: 'Three-Address Code (ICG), DAG & Code Optimization',
          analogy: 'Bade math expression `a + b * c - d` ko ek-ek chhote instruction `t1 = b * c`, `t2 = a + t1`, `t3 = t2 - d` me likhna hi Three-Address Code hai!',
          simpleExplanation: 'Three-Address Code me har instruction me max 1 operator aur 3 addresses hote hain. Isko Quadruple (op, arg1, arg2, result), Triple (op, arg1, arg2 — pointer indices), ya Indirect Triple me store karte hain. Optimization common subexpressions, dead code, aur loop-invariant statements ko hata kar speed badhata hai.',
          keyFormulasOrKeywords: [
            'Quadruple = 4 fields (op, arg1, arg2, result) — easy to reorder during optimization',
            'Loop Optimizations: Code Motion, Induction Variable Elimination, Loop Unrolling',
          ],
        },
      ],
    },
    notes: [
      { unit: 'Unit 1', title: 'Phases of Compiler, Lexical Analysis & Left Recursion Removal', summary: 'Six phases: Lexical, Syntax, Semantic, Intermediate Code Generation, Code Optimization, Code Generation, interacting with Symbol Table & Error Handler. Immediate left recursion A -> A alpha | beta transforms to A -> beta A\', A\' -> alpha A\' | eps.', keyPoints: ['Lexical Analyzer outputs tokens via Regular Expressions -> NFA -> Minimized DFA.', 'Bootstrapping uses T-diagrams to build self-hosting compilers.'] },
      { unit: 'Unit 2', title: 'Top-Down LL(1) & Bottom-Up LR Parsers', summary: 'LL(1) uses FIRST and FOLLOW sets to build a conflict-free predictive table. Bottom-Up Shift-Reduce handles Shift, Reduce, Accept, Error via LR(0), SLR(1), LALR(1), and CLR(1) automata.', keyPoints: ['LR parsers handle left-recursive grammars cleanly.', 'Handle pruning reverses rightmost derivation steps.'] },
      { unit: 'Unit 3', title: 'Intermediate Code (TAC) & Code Optimization', summary: 'Syntax Directed Translation emits Three-Address Code stored in Quadruples, Triples, or Indirect Triples. Basic Blocks & Control Flow Graphs enable DAG common-subexpression elimination, dead-code elimination, and loop code motion.', keyPoints: ['Quadruples make code movement easy in optimization.', 'Peephole optimization replaces redundant load/store patterns.'] },
    ],
    pyqs: [
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 1', frequency: 'MTT 1M', isImportant: true, question: 'Differentiate between Token, Pattern, and Lexeme.', answer: 'Lexeme = actual character sequence in source ("while"); Pattern = regex rule matching lexemes; Token = <token_name, attribute> pair sent to parser.', examTip: 'Give example `sum = 10`.' },
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 2', frequency: 'ETT 1M', isImportant: true, question: 'What does LL(1) stand for?', answer: 'Left-to-right scan of input, Leftmost derivation, 1 lookahead token.', examTip: 'LR(k) = Left-to-right, Rightmost derivation in reverse.' },
      { year: 2024, marks: 1, section: 'Section A', unit: 'Unit 2', frequency: 'ETT 1M', isImportant: true, question: 'Which LR parser is used by YACC / Bison and why?', answer: 'LALR(1) because it matches CLR(1) lookahead accuracy with SLR(1)\'s compact table size.', examTip: 'Merely merges identical LR(0) cores.' },
      { year: 2024, marks: 2, section: 'Section B', unit: 'Unit 1', frequency: 'MTT 2M', isImportant: true, question: 'Eliminate left recursion from E -> E + T | T and T -> T * F | F.', answer: 'E -> T E\' , E\' -> + T E\' | eps\nT -> F T\' , T\' -> * F T\' | eps.', examTip: 'Standard arithmetic grammar transformation.' },
      { year: 2025, marks: 5, section: 'Section C', unit: 'Unit 3', frequency: 'ETT 5M (Repeated 4x)', isImportant: true, question: 'Translate expression `a = b * -c + b * -c` into Three-Address Code, Quadruples, and Triples.', answer: 'TAC: t1 = uminus c; t2 = b * t1; t3 = uminus c; t4 = b * t3; t5 = t2 + t4; a = t5.\nQuadruple stores (op, arg1, arg2, result); Triple omits temp names and references row index `(0)`, `(1)` directly.', examTip: 'Use `uminus` for unary minus!' },
      { year: 2025, marks: 10, section: 'Section D', unit: 'Unit 2', frequency: 'MTT -> ETT 10M (5x)', isImportant: true, question: 'Compute FIRST and FOLLOW sets and construct the LL(1) Parsing Table for E -> T E\', E\' -> + T E\' | eps, T -> F T\', T\' -> * F T\' | eps, F -> ( E ) | id.', answer: 'FIRST(E)=FIRST(T)=FIRST(F)={(, id}; FIRST(E\')={+, eps}; FIRST(T\')={*, eps}.\nFOLLOW(E)=FOLLOW(E\')={), $}; FOLLOW(T)=FOLLOW(T\')={+, ), $}; FOLLOW(F)={*, +, ), $}.\nEach LL(1) table cell holds max 1 production -> Grammar IS LL(1).', examTip: 'Verify NO duplicate entries exist in any table cell!' },
      { year: 2024, marks: 10, section: 'Section D', unit: 'Unit 1', frequency: 'MTT Core -> ETT 10M', isImportant: true, question: 'Explain all 6 Phases of a Compiler showing exact output at each phase for `position = initial + rate * 60`.', answer: 'Lexical (<id,1> = <id,2> + <id,3> * 60) -> Syntax (Parse Tree) -> Semantic (inttofloat(60)) -> ICG (t1=inttofloat(60); t2=id3*t1; t3=id2+t2; id1=t3) -> Optimizer (t1=id3*60.0; id1=id2+t1) -> Target Assembly (MULF/ADDF/STF).', examTip: 'Draw Symbol Table alongside the 6 boxes.' },
    ],
  },
  {
    university: 'CT University (Ludhiana) / AKTU / IKGPTU',
    course: 'B.Tech CSE',
    semester: 'Sem 1',
    subject: 'Programming in C & Problem Solving',
    examType: 'End Term Test (ETT)',
    isGlobal: true,
    examPattern: {
      totalMarks: 60,
      duration: '3 Hours',
      passingMarks: '40% Overall',
      sections: CTU_ETT_60_SECTIONS,
      highWeightageTopics: ['Pointers & Call by Reference Swap', 'Arrays, Strings & Matrix Multiplication', 'Recursion (Factorial/Fibonacci)', 'Structures vs Unions & File Handling (fopen/fprintf)', 'Dynamic Memory malloc/calloc/free'],
    },
    crashSummary: {
      tagline: 'Zero-to-Exam C Programming Summary: Loops + Functions + Pointers + Structures + Files = Easy 50+/60!',
      passPlan: '1) Call by Value vs Call by Reference swap program har ETT me aata hai. 2) Structure vs Union difference + Matrix Multiplication / Palindrome code yaad karo.',
      units: [
        {
          unit: 'Unit 1 & 2',
          title: 'Data Types, Loops, Arrays & Functions (MTT Core)',
          analogy: 'Array ek multi-compartment train hai jahan har dabba 0 se number hota hai aur sab me ek hi type ka samaan (int/char) baith sakta hai!',
          simpleExplanation: 'C program `main()` se start hota hai. `for` loop fixed counts ke liye, `while` condition-based, `do-while` kam se kam 1 baar chalne ke liye. Functions code reuse karte hain aur Recursion tab hota hai jab function khud ko chhote input par call kare.',
          keyFormulasOrKeywords: ['Array index: 0 to N-1', 'String ends with null char \'\\0\'', 'Base Case stops infinite recursion'],
        },
        {
          unit: 'Unit 3 & 4',
          title: 'Pointers, Structures vs Unions & File Handling',
          analogy: 'Normal variable ghar ka samaan hai; Pointer us ghar ka ADDRESS (House Number) store karta hai jisse function ke bahar bhi actual value change ki ja sake!',
          simpleExplanation: 'Pointer `int *p = &x;` memory address store karta hai. Call by Reference pointers pass karke caller ka variable directly badal deta hai. Structure sabhi members ko alag memory deta hai; Union sabse bade member jitni memory share karta hai. `malloc` uninitialized memory deta hai; `calloc` zero-initialized array deta hai.',
          keyFormulasOrKeywords: ['& = address-of, * = dereference value-at', 'sizeof(struct) = sum; sizeof(union) = max member', 'fopen("a.txt", "r"/"w"/"a") + fclose(fp)'],
        },
      ],
    },
    notes: [
      { unit: 'Unit 1', title: 'Control Flow, Arrays, Recursion & Pointers', summary: 'Covers operators, switch-case, loops, 2D arrays, pointers, and Call by Value vs Reference.', keyPoints: ['*ptr accesses value; ptr++ advances by sizeof(type) bytes.', 'malloc allocates uninitialized bytes; calloc initializes all bits to 0.'] },
      { unit: 'Unit 2', title: 'Structures, Unions & File Handling', summary: 'Structures aggregate heterogeneous data (`struct`); Unions overlay members in shared memory (`union`). File I/O uses FILE* pointers.', keyPoints: ['fprintf/fscanf for text files; fread/fwrite for binary files.', 'Always call free(ptr) to prevent memory leaks.'] },
    ],
    pyqs: [
      { year: 2025, marks: 1, section: 'Section A', unit: 'Unit 1', frequency: 'MTT 1M', isImportant: true, question: 'What is a Null Pointer vs Dangling Pointer?', answer: 'Null pointer points intentionally to nothing (NULL); Dangling pointer still holds address of already freed/out-of-scope memory.', examTip: 'Set ptr = NULL after free(ptr).' },
      { year: 2025, marks: 2, section: 'Section B', unit: 'Unit 2', frequency: 'ETT 2M', isImportant: true, question: 'Compare Structure vs Union on memory allocation and access.', answer: 'Struct allocates separate memory for EVERY member (access all anytime); Union shares ONE memory block equal to largest member (only one active at a time).', examTip: 'Give byte size example (int 4 + char 1).' },
      { year: 2024, marks: 5, section: 'Section C', unit: 'Unit 1', frequency: 'MTT -> ETT 5M', isImportant: true, question: 'Write a C program to swap two numbers using Call by Value vs Call by Reference (Pointers) and explain output.', answer: 'Call by Value copies values into local params (originals unchanged). Call by Reference passes `&a, &b` to `void swap(int *x, int *y)` modifying original memory directly.', examTip: 'Trace memory addresses cleanly.' },
      { year: 2025, marks: 10, section: 'Section D', unit: 'Unit 2', frequency: 'ETT 10M', isImportant: true, question: 'Explain Dynamic Memory Allocation (malloc, calloc, realloc, free) and write a C program using `struct Student` to store N students and write records to a file.', answer: 'malloc(n*sizeof(T)) returns void* garbage; calloc(n, sizeof(T)) zero-initializes; realloc resizes; free releases heap. Combine `struct Student *s = malloc(...)`, loop `scanf`, `FILE *fp = fopen("students.txt", "w")`, `fprintf`, `fclose`, `free(s)`.', examTip: 'Always check `if (fp == NULL)` in file programs!' },
    ],
  },
];
