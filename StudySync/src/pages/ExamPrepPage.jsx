import { useState, useEffect, useCallback } from 'react';
import { useStudy } from '../context/StudyContext';
import { apiFetch } from '../utils/api';
import { Modal, Pill, Tabs, StatCard, SearchInput, EmptyState, ProgressBar } from '../components/ui';
import VisualDiagram from '../components/ui/VisualDiagram';
import {
  LuBookOpenCheck, LuGraduationCap, LuSparkles, LuCheck, LuBookmark,
  LuChevronDown, LuChevronUp, LuPlus, LuFileText, LuLayers, LuTrash2, LuCopy
} from 'react-icons/lu';

const QUICK_COURSES = ['B.Tech CSE', 'BCA', 'MCA', 'B.Sc CS', 'ETT / D.El.Ed', 'BBA / B.Com'];
const SEMESTER_OPTIONS = ['All Semesters', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Year 1 & Year 2'];
const EXAM_TYPES = ['All Exam Types', 'End Term Test (ETT)', 'Mid Term (MST)', 'Semester Final', 'ETT Board Exam'];

function normalizeCourseMatch(raw) {
  const c = (raw || '').toLowerCase().replace(/[\s.\-_/]+/g, '');
  if (c.includes('btech') || c.includes('becse') || c === 'cse') return 'B.Tech CSE';
  if (c.includes('bca')) return 'BCA';
  if (c.includes('mca')) return 'MCA';
  if (c.includes('bsc')) return 'B.Sc CS';
  if (c.includes('ett') || c.includes('deled')) return 'ETT / D.El.Ed';
  if (c.includes('bba') || c.includes('bcom') || c.includes('mba')) return 'BBA / B.Com';
  return raw || '';
}

const DEMO_FALLBACK_META = {
  universities: ['CT University (Ludhiana)', 'AKTU', 'IKGPTU', 'All Universities'],
  courses: ['B.Tech CSE', 'BCA', 'MCA', 'B.Sc CS', 'ETT / D.El.Ed'],
  semesters: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
  examTypes: ['End Term Test (ETT)', 'Mid Term (MST)', 'Semester Final'],
  subjects: ['Data Structures & Algorithms', 'Discrete Structures & Graph Theory', 'Database Management Systems'],
  subjectCatalog: [
    { course: 'B.Tech CSE', semester: 'Sem 3', subject: 'Data Structures & Algorithms' },
    { course: 'B.Tech CSE', semester: 'Sem 3', subject: 'Discrete Structures & Graph Theory' },
    { course: 'B.Tech CSE', semester: 'Sem 4', subject: 'Database Management Systems' },
  ],
};

const DEMO_FALLBACK_PACKS = [
  {
    id: 'demo_pack_dsa',
    university: 'CT University / AKTU / IKGPTU',
    course: 'B.Tech CSE',
    semester: 'Sem 3',
    subject: 'Data Structures & Algorithms',
    examType: 'End Term Test (ETT)',
    examPattern: {
      totalMarks: 60,
      passMarks: 24,
      structure: 'Section A (10x1M=10M), Section B (5x2M=10M), Section C (4x5M=20M), Section D (2x10M=20M)',
      highWeightageTopics: [
        'AVL Tree Balance Rotations (LL, RR, LR, RL)',
        'B+ Tree Splitting & Insertion (Order 3/4)',
        'Dijkstra Shortest Path & Prim MST Algorithm',
        'Quick Sort & Merge Sort Recurrence & Proofs',
      ],
    },
    crashSummary: {
      tagline: 'Zero-to-Exam DSA Master Guide: Full 6 Units in Depth (2-3 Pages per Unit)!',
      passPlan: '1) Unit 1: Infix to Postfix stack conversion + Linked List Reversal (15M). 2) Unit 2: Circular queue wrapping + Heap (10M). 3) Unit 3: BST 3 deletion cases (10M). 4) Unit 4: AVL balance rotations LL/RR/LR/RL (10M). 5) Unit 5: Dijkstra shortest path (10M). 6) Unit 6: QuickSort partition + Hashing collisions (10M).',
      units: [
        {
          unit: 'Unit 1',
          title: 'Linear Data Structures: Arrays, Linked Lists, Stacks & Infix-to-Postfix',
          analogy: 'Stack ek plate stand ya cafeteria tray dispenser jaisa hai: Last In, First Out (LIFO). Jo plate sabse aakhri me rakhi gayi, wahi sabse pehle uthegi! Browser ka Back button aur Text Editor ka Undo (Ctrl+Z) bhi stack data structure se chalta hai. Linked list treasure hunt clues jaisa hai: har clue agle clue ka memory address batata hai!',
          simpleExplanation: '• Arrays provide O(1) random index access but costly O(n) element shifting for inserts/deletes.\n• Linked lists allocate dynamic nodes [Data | Next], giving O(1) insertions at known pointers.\n• Three-pointer list reversal: prev=NULL, curr=head, next=NULL; in a loop: next=curr->next, curr->next=prev, prev=curr, curr=next.\n• Stack ADT (LIFO) supports push, pop, and peek.\n• Infix to Postfix: Operands go straight to output, operators pushed to stack based on precedence rules.',
          coreTheory: `### 1. Asymptotic Big-O Analysis & Computational Growth
• Asymptotic notations describe algorithm scalability as input size n grows to infinity.
• Big-O (O): Formal upper bound (Worst-Case). f(n) <= c * g(n) for all n >= n0.
• Big-Omega (Ω): Formal lower bound (Best-Case). f(n) >= c * g(n).
• Big-Theta (Θ): Tight asymptotic bound where upper and lower bounds coincide.
• Growth hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).

### 2. Contiguous Arrays vs Dynamic Linked Lists
• Arrays: Memory allocated as a contiguous block. Provides blazing O(1) random lookup by direct formula: Address(A[i]) = BaseAddress + i * sizeof(DataType). However, fixed size requires re-allocation, and insertions/deletions in the middle require shifting O(n) elements.
• Linked Lists: Memory allocated on heap node-by-node. Each node consists of [Data | Pointer]. No wasted contiguous space. Inserting at the head is O(1). However, searching requires sequential traversal O(n) and extra pointer overhead (4-8 bytes per node).

### 3. Singly, Doubly & Circular Linked Lists
• Singly Linked List: Nodes linked sequentially in one direction. Cannot traverse backward.
• Doubly Linked List: Nodes contain [Prev | Data | Next]. Enables bidirectional traversal and O(1) node deletion when the pointer to that node is already known:
  \`p->prev->next = p->next; p->next->prev = p->prev; free(p);\`
• Circular Linked List: Tail node's next pointer points directly back to Head instead of NULL. Crucial for operating system CPU round-robin time-slicing.

### 4. Stack Abstract Data Type & Infix-to-Postfix Conversion
• Stack operates on LIFO (Last-In, First-Out).
• Fundamental operations:
  - push(val): increments top; checks for Overflow (top == MAX - 1).
  - pop(): returns item and decrements top; checks for Underflow (top == -1).
  - peek(): returns stack[top] without removing.
• Why Postfix notation? Computers cannot parse ambiguous parenthesized infix expressions easily. Postfix (Reverse Polish Notation) eliminates parenthesis and operator precedence ambiguities during execution.
• Shunting-Yard Algorithm Rules:
  1. Print operands (A, B, 10, etc.) immediately to output.
  2. If operator, pop operators from stack to output while stack top has higher or equal precedence. Then push incoming operator.
  3. If '(', push onto stack.
  4. If ')', pop from stack to output until '(' is encountered; discard '('.`,
          algorithmOrCode: `// Complete C Implementation: Infix to Postfix Conversion
#include <stdio.h>
#include <ctype.h>

char stack[100];
int top = -1;

void push(char x) { stack[++top] = x; }
char pop() { return (top == -1) ? -1 : stack[top--]; }

int precedence(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

void infixToPostfix(char* exp) {
    char *e = exp;
    while (*e != '\\0') {
        if (isalnum(*e)) {
            printf("%c ", *e); // Operands printed directly
        } else if (*e == '(') {
            push(*e);
        } else if (*e == ')') {
            while (top != -1 && stack[top] != '(')
                printf("%c ", pop());
            pop(); // Remove '('
        } else {
            while (top != -1 && precedence(stack[top]) >= precedence(*e))
                printf("%c ", pop());
            push(*e);
        }
        e++;
    }
    while (top != -1) printf("%c ", pop());
}
// Time Complexity: O(N) | Space Complexity: O(N)`,
          keyFormulasOrKeywords: [
            'Big-O: f(n) <= c * g(n) (Upper bound)',
            'Stack LIFO: push at top, pop at top',
            'Overflow: top == MAX - 1',
            'Underflow: top == -1',
            'List Reversal: curr->next = prev; prev = curr; curr = next;',
            'Postfix: Operands directly to output; Operators prioritized via stack',
          ],
          diagram: 'linked-list',
          examBlueprint: {
            blueprint: '1. Definition & Memory Layout (2 Marks)\n2. Complete Infix to Postfix Step-by-Step Trace Table (4 Marks)\n3. Algorithm / Working C Implementation (2 Marks)\n4. Time & Space Complexity Analysis (2 Marks)',
            pitfalls: 'Common Pitfall: Forgetting to verify top == -1 before pop() leads to Stack Underflow segfault. In postfix conversion, always pop until "(" when ")" is reached, but never print "(" to output!',
          },
        },
        {
          unit: 'Unit 2',
          title: 'Queues, Circular Queues, Deque & Priority Queues (Binary Heap)',
          analogy: 'Queue movie ticket ya metro counter line hai: First In, First Out (FIFO). Jo pehle line me laga, uska ticket pehle banega! Circular queue gol round-table jaisi hai: deletion ke baad samne ki khali seats waste nahi hoti, rear ghoom kar index 0 par aa jata hai! Priority Queue hospital ICU emergency triage jaisa hai: arrival time se pehle critical patient ka ilaaj hota hai!',
          simpleExplanation: '• Linear Queue: Insert at Rear, remove from Front. Limitation: "False Overflow" (Rear reaches end while front has free slots).\n• Circular Queue uses modulo arithmetic: (rear + 1) % MAX == front.\n• Double-Ended Queue (Deque): Insertions and deletions permitted at both front and rear.\n• Priority Queue: Highest priority served first, implemented efficiently with Binary Min/Max Heaps.',
          coreTheory: `### 1. Linear Queue FIFO Mechanics & The "False Overflow" Bug
• A linear queue maintains two pointers: Front (for deletions) and Rear (for insertions).
• Initially, Front = -1 and Rear = -1.
• On Enqueue: Rear = Rear + 1; Queue[Rear] = value.
• On Dequeue: Item = Queue[Front]; Front = Front + 1.
• The "False Overflow" Bug: When elements are repeatedly enqueued and dequeued, Rear eventually hits MAX - 1. The program reports "Queue Overflow", even though the front slots (0 to Front-1) are completely empty!

### 2. Circular Queue Architecture & Modulo Index Wrapping
• Circular queue treats the array as a continuous ring by wrapping indices using modulo arithmetic:
  - Enqueue: \`rear = (rear + 1) % MAX;\`
  - Dequeue: \`front = (front + 1) % MAX;\`
• Boundary Conditions:
  - Empty Condition: \`front == -1 && rear == -1\`
  - Full Condition: \`(rear + 1) % MAX == front\`
• When inserting into an empty circular queue, both Front and Rear are initialized to 0.

### 3. Double-Ended Queue (Deque)
• Deque allows insertion and deletion from both ends (Front and Rear).
• Variants:
  1. Input-Restricted Deque: Insertion allowed at only one end, deletion allowed at both ends.
  2. Output-Restricted Deque: Deletion allowed at only one end, insertion allowed at both ends.
• Applications: Undo/Redo operations, sliding window maximum algorithms in competitive programming.

### 4. Priority Queue & Binary Heap Architecture
• Elements possess an intrinsic priority value. Elements with higher priority are dequeued before lower priority ones regardless of insertion order.
• Implementation efficiency comparison:
  - Unsorted Array: Enqueue O(1), Dequeue O(n).
  - Sorted Array: Enqueue O(n), Dequeue O(1).
  - Binary Heap (Complete Binary Tree): Enqueue O(log n), Dequeue O(log n).
• Array Representation of Binary Heap:
  - Node at index i:
    * Parent = floor((i - 1) / 2)
    * Left Child = 2i + 1
    * Right Child = 2i + 2`,
          algorithmOrCode: `// Complete C Implementation: Circular Queue
#define MAX 5
int cq[MAX], front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % MAX == front) {
        printf("Circular Queue Overflow!\\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    cq[rear] = val;
}

int dequeue() {
    if (front == -1) {
        printf("Circular Queue Underflow!\\n");
        return -1;
    }
    int item = cq[front];
    if (front == rear) front = rear = -1; // Reset when last element dequeued
    else front = (front + 1) % MAX;
    return item;
}
// Time Complexity: O(1) for both Enqueue & Dequeue`,
          keyFormulasOrKeywords: [
            'Queue FIFO: Enqueue at Rear, Dequeue at Front',
            'Circular Enqueue: rear = (rear + 1) % MAX',
            'Circular Dequeue: front = (front + 1) % MAX',
            'Full: (rear + 1) % MAX == front',
            'Empty: front == -1',
            'Binary Heap: Left=2i+1, Right=2i+2, Parent=(i-1)/2',
          ],
          diagram: 'generic',
          examBlueprint: {
            blueprint: '1. Linear Queue Limitation & Circular Solution Explanation (2 Marks)\n2. Modulo Arithmetic Formulae & Boundary Conditions (3 Marks)\n3. Working C Code for Enqueue & Dequeue (3 Marks)\n4. Priority Queue Heap Array Equations (2 Marks)',
            pitfalls: 'Pitfall: When the last remaining element is dequeued in circular queue, always remember to reset front = rear = -1, otherwise queue remains incorrectly non-empty!',
          },
        },
        {
          unit: 'Unit 3',
          title: 'Binary Trees, Binary Search Trees (BST) & Deletion Algorithms',
          analogy: 'BST ek telephone directory ya dictionary jaisa hai: Root ke Left me chhote naam (keys), aur Right me bade naam! Dhoondhna super fast hota hai: har step pe aadhi kitaab discard ho jati hai (O(log n))! Deletion 3 cases me hota hai: patta todna (Leaf), pipeline jodna (1 child), ya sabse kabil successor ko gaddi dena (2 children)!',
          simpleExplanation: '• Binary Search Tree Property: Left Subtree < Root < Right Subtree.\n• Inorder Traversal (Left -> Root -> Right) of a BST ALWAYS yields sorted keys.\n• BST 3 Deletion Cases: (1) Leaf Node (free directly), (2) One Child (link parent to child), (3) Two Children (replace key with Inorder Successor, then delete successor).\n• Skewed BST worst-case lookup degenerates to O(n).',
          coreTheory: `### 1. Binary Tree Terminology & Mathematical Properties
• Tree: A hierarchical, non-linear data structure with 1 root and N - 1 directed edges.
• Degree of a node: Number of children of that node.
• Leaf node: Node with degree 0.
• Mathematical Tree Invariants:
  - Maximum nodes at level L (where root is level 0): 2ᴸ.
  - Maximum nodes in binary tree of height H: 2^(H+1) - 1.
  - Minimum height of binary tree with N nodes: ceil(log2(N + 1)) - 1.
  - For any non-empty binary tree: Number of leaf nodes (N0) = Number of nodes of degree 2 (N2) + 1. (Proof: Total edges = N - 1 = N1 + 2*N2; Total nodes N = N0 + N1 + N2; Equating yields N0 = N2 + 1).

### 2. Binary Search Tree (BST) Ordering Invariant
• For every node X in the tree:
  - Every key in the Left Subtree of X is strictly LESS than X.key.
  - Every key in the Right Subtree of X is strictly GREATER than X.key.
• Searching:
  - If target == root.key: Found.
  - If target < root.key: Search left subtree.
  - If target > root.key: Search right subtree.
• Average Search Time: O(log n); Worst Case (Skewed BST): O(n).

### 3. Binary Tree Traversals
• Depth-First Traversals (Recursive / Stack):
  1. Inorder (L - Root - R): Produces keys in strictly ASCENDING sorted order!
  2. Preorder (Root - L - R): Used to serialize/clone trees and evaluate prefix expressions.
  3. Postorder (L - R - Root): Used to delete tree nodes from bottom-up and evaluate postfix syntax trees.
• Breadth-First Traversal (Level Order): Uses a FIFO Queue to visit nodes level-by-level from top to bottom, left to right.

### 4. BST Node Deletion — The 3 Classical University Cases
• Case 1: Node to delete is a LEAF node (0 children).
  - Action: Simply set parent pointer to NULL and free the node memory.
• Case 2: Node has EXACTLY ONE child.
  - Action: Bypass the node. Link the parent directly to the child of the target node, then free the target node.
• Case 3: Node has TWO children (Most important 10M exam question!).
  - Action: You cannot delete the node directly without disconnecting subtrees.
  - Find the node's INORDER SUCCESSOR (smallest node in the Right Subtree, found by traversing left from right child until NULL).
  - Copy the Inorder Successor's key into the target node.
  - Recursively call delete on the Inorder Successor (which is guaranteed to have at most 1 child, reducing to Case 1 or Case 2!).`,
          algorithmOrCode: `// Complete C Implementation: BST Deletion (All 3 Cases)
struct Node* findMin(struct Node* root) {
    while (root->left != NULL) root = root->left;
    return root;
}

struct Node* deleteBST(struct Node* root, int key) {
    if (root == NULL) return root;
    if (key < root->data) root->left = deleteBST(root->left, key);
    else if (key > root->data) root->right = deleteBST(root->right, key);
    else {
        // Case 1 & 2: 0 or 1 child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }
        // Case 3: 2 children
        struct Node* temp = findMin(root->right); // Inorder Successor
        root->data = temp->data;
        root->right = deleteBST(root->right, temp->data);
    }
    return root;
}
// Time Complexity: O(h) where h is tree height (O(log n) avg, O(n) worst)`,
          keyFormulasOrKeywords: [
            'BST Invariant: Left < Root < Right',
            'Inorder Traversal: ALWAYS outputs sorted sequence',
            'Leaf nodes theorem: N0 = N2 + 1',
            'Max nodes at height h: 2^(h+1) - 1',
            'Inorder Successor: Minimum node in Right Subtree',
            'Search: O(log n) average, O(n) worst',
          ],
          diagram: 'avl',
          examBlueprint: {
            blueprint: '1. State BST property and draw diagram (2 Marks)\n2. Detail the 3 Deletion Cases with Before/After sketches (4 Marks)\n3. Working Recursive C/C++ Code with findMin (3 Marks)\n4. Complexity analysis for balanced vs skewed trees (1 Mark)',
            pitfalls: 'Crucial Exam Warning: In Case 3, never delete the target node directly; copy the successor data and delete the successor node from the right subtree!',
          },
        },
        {
          unit: 'Unit 4',
          title: 'Self-Balancing Trees: AVL Trees & Balance Rotations (LL, RR, LR, RL)',
          analogy: 'AVL Tree ek electronic balancing machine jaisa hai: agar left pan me zyada wazan ho gaya toh right ghuma kar balance barabar kar leta hai! Balance factor hamesha -1, 0, ya +1 rehna chahiye. Agar balance factor +2 ya -2 ho gaya, toh ek single ya double rotation se tree wapas perfect balance me aa jata hai!',
          simpleExplanation: '• Balance Factor (BF) = Height(Left Subtree) - Height(Right Subtree). Allowable values: {-1, 0, +1}.\n• LL Imbalance (BF=+2, child=+1) -> Single Right Rotation.\n• RR Imbalance (BF=-2, child=-1) -> Single Left Rotation.\n• LR Imbalance (BF=+2, child=-1) -> Left Rotate Child, then Right Rotate Parent.\n• RL Imbalance (BF=-2, child=+1) -> Right Rotate Child, then Left Rotate Parent.\n• Guarantees strictly O(log n) worst-case time for Search, Insert, and Delete.',
          coreTheory: `### 1. Why Self-Balancing Trees Are Mandatory
• In standard BSTs, inserting sorted data (e.g. 10, 20, 30, 40, 50) results in a degenerate skewed tree equivalent to a linked list, collapsing lookup performance from O(log n) to O(n).
• Adelson-Velsky and Landis (1962) invented the AVL Tree, the first dynamically self-balancing binary search tree.

### 2. Balance Factor Definition & Strict Bounds
• Balance Factor: \`BF(Node) = Height(LeftSubtree) - Height(RightSubtree)\`
• In an AVL tree, every single node must strictly satisfy: \`BF(Node) ∈ {-1, 0, +1}\`
• If an insertion or deletion causes any node to achieve BF = +2 or BF = -2, an imbalance has occurred at that critical node, triggering immediate rotational rebalancing.
• Mathematical Height Bound: Height h of an AVL tree with n nodes is bounded by \`h < 1.44 * log2(n + 2)\`. This mathematically guarantees that worst-case lookup, insertion, and deletion NEVER exceed O(log n).

### 3. The 4 Fundamental AVL Balance Rotations
1. LL Imbalance (Left-Left):
   - Cause: A new node is inserted into the left subtree of the left child.
   - Indicator: Critical node has BF = +2; its left child has BF = +1.
   - Solution: Single RIGHT Rotation around the critical node.
2. RR Imbalance (Right-Right):
   - Cause: A new node is inserted into the right subtree of the right child.
   - Indicator: Critical node has BF = -2; its right child has BF = -1.
   - Solution: Single LEFT Rotation around the critical node.
3. LR Imbalance (Left-Right):
   - Cause: A new node is inserted into the right subtree of the left child.
   - Indicator: Critical node has BF = +2; its left child has BF = -1.
   - Solution: Double Rotation:
     Step A: Single Left Rotation around Left Child.
     Step B: Single Right Rotation around Parent (Critical Node).
4. RL Imbalance (Right-Left):
   - Cause: A new node is inserted into the left subtree of the right child.
   - Indicator: Critical node has BF = -2; its right child has BF = +1.
   - Solution: Double Rotation:
     Step A: Single Right Rotation around Right Child.
     Step B: Single Left Rotation around Parent (Critical Node).

### 4. B-Trees & B+ Trees for Database Storage
• Unlike binary trees, B-Trees and B+ Trees are multi-way search trees designed for external storage (disk blocks).
• High fan-out (M children per node) ensures shallow tree height (2-3 levels for millions of records), minimizing disk I/O seek operations.
• B+ Tree Key Invariant: All actual data records are stored exclusively in the Leaf nodes. Leaf nodes are linked sequentially via pointers, enabling lightning-fast range queries (\`SELECT * WHERE age BETWEEN 20 AND 30\`).`,
          algorithmOrCode: `// Complete C Implementation: AVL Right and Left Rotations
struct Node {
    int key, height;
    struct Node *left, *right;
};

int getHeight(struct Node *n) { return (n == NULL) ? 0 : n->height; }
int getBF(struct Node *n) { return (n == NULL) ? 0 : getHeight(n->left) - getHeight(n->right); }

struct Node* rightRotate(struct Node *y) {
    struct Node *x = y->left;
    struct Node *T2 = x->right;
    // Perform rotation
    x->right = y;
    y->left = T2;
    // Update heights
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    return x; // New root
}

struct Node* leftRotate(struct Node *x) {
    struct Node *y = x->right;
    struct Node *T2 = y->left;
    // Perform rotation
    y->left = x;
    x->right = T2;
    // Update heights
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    return y; // New root
}
// Time Complexity: O(1) rotation time | Space Complexity: O(1)`,
          keyFormulasOrKeywords: [
            'BF = Height(Left) - Height(Right)',
            'Valid BF: {-1, 0, +1}',
            'LL Imbalance -> Single Right Rotate',
            'RR Imbalance -> Single Left Rotate',
            'LR Imbalance -> Left Rotate Child + Right Rotate Root',
            'RL Imbalance -> Right Rotate Child + Left Rotate Root',
            'Guaranteed Time: O(log n) for all operations',
          ],
          diagram: 'avl_rotation',
          examBlueprint: {
            blueprint: '1. Definition of AVL tree and Balance Factor Formula (2 Marks)\n2. Diagrammatic derivation of LL, RR, LR, RL rotations (4 Marks)\n3. Step-by-step trace of inserting sequence (e.g. 10, 20, 30, 40, 50, 25) (3 Marks)\n4. B+ Tree differences for DB indexing (1 Mark)',
            pitfalls: 'Always recalculate and write the Balance Factor next to EVERY node in your answer sheet before and after each rotation!',
          },
        },
        {
          unit: 'Unit 5',
          title: 'Graph Algorithms, Traversals, Dijkstra Shortest Path & Minimum Spanning Trees',
          analogy: 'BFS paani me patthar phenkne jaisa hai: ripples ek-ek level badhti hain (Queue). DFS bhool-bhulaiya (maze) me chalna hai: aakhri dead-end tak jao, phir wapas aao (Stack). Dijkstra ek GPS navigation system hai jo Google Maps ki tarah aapke ghar se har shahar ka sabse sasta raasta nikalta hai! Kruskal aur Prim telecom company jaise hain jo kam se kam kharche me sabhi shaharon me fiber optic cable bichhate hain!',
          simpleExplanation: '• Graph Representations: Adjacency Matrix (O(V²) memory) vs Adjacency List (O(V+E) memory).\n• BFS: Uses Queue, level-by-level traversal, discovers shortest paths in unweighted graphs.\n• DFS: Uses Stack / Recursion, deep exploration, topological sort, detects cycles.\n• Dijkstra Algorithm: Greedy single-source shortest path for non-negative weighted graphs using Min-Heap relaxation.\n• Minimum Spanning Tree (MST): Kruskal (Sort edges + Disjoint Set Union) and Prim (Grow tree vertex by vertex).',
          coreTheory: `### 1. Graph Fundamentals & Memory Representations
• Graph G = (V, E) consists of a set of vertices V and edges E.
• Handshaking Lemma: In any graph, the sum of degrees of all vertices equals twice the number of edges: \`Σ deg(v) = 2|E|\`. Consequently, the number of vertices with odd degree is ALWAYS even!
• Adjacency Matrix: 2D array of size V x V. Matrix[i][j] = weight or 1 if edge exists. Space: O(V²). Fast edge lookup O(1), but wasteful for sparse graphs.
• Adjacency List: Array of linked lists of size V. List[u] stores all adjacent vertices v. Space: O(V + E). Optimal for sparse real-world graphs.

### 2. Graph Traversals: BFS vs DFS
• Breadth-First Search (BFS):
  - Mechanism: Uses a FIFO Queue and a \`visited[]\` boolean array.
  - Enqueue source vertex; while queue not empty, dequeue vertex u and enqueue all unvisited neighbors of u, marking them visited.
  - Time Complexity: O(V + E) with Adjacency List.
  - Key Property: Discovers shortest paths (minimum number of edges) in unweighted graphs.
• Depth-First Search (DFS):
  - Mechanism: Uses Call Stack or explicit LIFO Stack.
  - Visits adjacent unvisited vertices deeply until no forward path exists, then backtracks.
  - Time Complexity: O(V + E).
  - Applications: Cycle detection, Topological Sorting in DAGs, finding strongly connected components.

### 3. Dijkstra's Single-Source Shortest Path Algorithm
• Strategy: Greedy choice property.
• Input: Weighted graph with NON-NEGATIVE edge weights (w(u, v) >= 0) and source vertex S.
• Data structures: Distance array \`dist[]\` initialized to infinity (dist[S] = 0), and Min-Priority Queue.
• Algorithm Loop:
  1. Extract vertex u with minimum \`dist[u]\` from unvisited set.
  2. For each unvisited neighbor v of u:
     **Relaxation Step:**
     \`if (dist[u] + weight(u, v) < dist[v]) {\`
     \`    dist[v] = dist[u] + weight(u, v);\`
     \`}\`
  3. Mark u as visited. Repeat until all vertices processed.
• Why does Dijkstra FAIL with negative edge weights?
  Dijkstra assumes that once a vertex is marked visited, its shortest distance is finalized and cannot be decreased. A negative edge weight later in the graph can reduce an already finalized path cost, which violates the greedy assumption! Use Bellman-Ford for negative edge weights.

### 4. Minimum Spanning Trees (MST)
• A Spanning Tree of a connected graph G with V vertices is an acyclic subgraph connecting all V vertices using exactly V - 1 edges.
• The Minimum Spanning Tree (MST) minimizes the sum of edge weights.
• Kruskal's Algorithm:
  1. Sort all E edges in non-decreasing order of weight.
  2. Initialize V disjoint single-element sets (DSU).
  3. Iterate through sorted edges: if Find(u) != Find(v), add edge (u, v) to MST and perform Union(u, v). Discard if it forms a cycle.
  4. Time: O(E log E).
• Prim's Algorithm:
  1. Start with arbitrary vertex in MST set.
  2. Greedily pick the lowest-weight edge connecting a vertex in MST to a vertex outside MST.
  3. Time: O((V + E) log V) with Min-Heap.`,
          algorithmOrCode: `// Complete C++ Dijkstra Relaxation Algorithm
#include <vector>
#include <queue>
using namespace std;

void dijkstra(int src, int V, vector<pair<int,int>> adj[]) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(V, 1e9);

    dist[src] = 0;
    pq.push({0, src}); // {distance, vertex}

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            // Relaxation Step
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}
// Time Complexity: O((V + E) log V) | Space: O(V)`,
          keyFormulasOrKeywords: [
            'Handshaking Lemma: Σ deg(v) = 2|E|',
            'Tree of V vertices has V - 1 edges',
            'BFS uses Queue O(V + E)',
            'DFS uses Stack O(V + E)',
            'Relaxation: dist[v] = min(dist[v], dist[u] + w(u,v))',
            'Dijkstra Time: O((V + E) log V) via Min-Heap',
            'Fails on negative edges: Use Bellman-Ford O(VE)',
          ],
          diagram: 'osi_stack',
          examBlueprint: {
            blueprint: '1. Adjacency Matrix vs List trade-offs (2 Marks)\n2. Complete Dijkstra Algorithm & Step-by-Step Distance Trace Table (4 Marks)\n3. Negative weight failure counterexample (2 Marks)\n4. Prim vs Kruskal comparison table (2 Marks)',
            pitfalls: 'In university papers, always draw the complete distance table for each step of Dijkstra showing Selected Vertex, Updated Distances, and Visited Array!',
          },
        },
        {
          unit: 'Unit 6',
          title: 'Sorting Paradigms (QuickSort, MergeSort) & Hashing Collision Techniques',
          analogy: 'QuickSort sports teacher jaisa hai: ek student ko pivot chunta hai, usse chhote bache left khade karta hai, bade bache right! MergeSort taash ke patte do barabar hisson me baant kar alag-alag sort karke zip ki tarah merge karna hai! Hashing mall ka luggage locker jaisa hai: aapka token number seedhe aapka locker index batata hai bina kisi search ke (O(1))!',
          simpleExplanation: '• QuickSort: Divide-and-Conquer. Partition around pivot. Average O(n log n), worst case O(n²) when array already sorted.\n• MergeSort: Guaranteed O(n log n) in all cases, stable, but requires O(n) auxiliary memory.\n• Hashing: Maps keys to array indices via hash function h(k) = k % m.\n• Collision Resolution: (1) Separate Chaining (Linked lists), (2) Open Addressing (Linear Probing, Quadratic, Double Hashing).',
          coreTheory: `### 1. Divide-and-Conquer Sorting Paradigms
• QuickSort:
  - Select an element as Pivot (First, Last, Random, or Median-of-three).
  - Partitioning (Lomuto or Hoare): Rearrange array so all elements < pivot appear before it, and all elements > pivot appear after it. The pivot is now placed in its FINAL sorted position!
  - Recursively sort the sub-arrays.
  - Recurrence Relation (Average case): T(n) = 2T(n/2) + O(n) => O(n log n).
  - Worst Case: T(n) = T(n - 1) + O(n) => O(n²), which occurs when the array is already sorted or reverse sorted and the first/last element is picked as pivot.
• MergeSort:
  - Recursively divide array into two equal halves until size = 1.
  - Merge the two sorted halves in linear O(n) time using temporary array.
  - Recurrence: T(n) = 2T(n/2) + O(n) => O(n log n) in ALL cases (Best, Average, Worst!).
  - Advantage: Stable sort (preserves relative order of duplicate keys).
  - Disadvantage: Requires O(n) extra auxiliary memory.

### 2. Master Theorem for Divide-and-Conquer
• Recurrence Form: \`T(n) = a*T(n/b) + f(n)\` where a >= 1, b > 1.
• Compare f(n) with n^(log_b a):
  - Case 1: If f(n) = O(n^(log_b a - ε)), then \`T(n) = Θ(n^(log_b a))\`.
  - Case 2: If f(n) = Θ(n^(log_b a) * log^k n), then \`T(n) = Θ(n^(log_b a) * log^(k+1) n)\`.
  - Case 3: If f(n) = Ω(n^(log_b a + ε)) and regularity holds, then \`T(n) = Θ(f(n))\`.

### 3. Hash Tables & Collision Resolution
• Direct Addressing is impractical when key universe U is vast. Hash table uses array of size m and hash function \`h: U -> {0, 1, ..., m-1}\`.
• Hash Collision: When two distinct keys yield the same index: \`h(k1) == h(k2)\`.
• Collision Resolution Technique 1: Separate Chaining (Open Hashing)
  - Each bucket contains a linked list of collided keys.
  - Keys with same hash are appended to the list.
  - Load Factor α = n / m. Average search time: O(1 + α).
  - Advantages: Never runs out of space; easy deletion.
• Collision Resolution Technique 2: Open Addressing (Closed Hashing)
  - All elements reside inside the hash table itself (m >= n).
  - If slot is occupied, probe for the next available slot:
    1. Linear Probing: \`h(k, i) = (h'(k) + i) % m\`. Suffers from Primary Clustering (consecutive occupied blocks grow, increasing lookup time).
    2. Quadratic Probing: \`h(k, i) = (h'(k) + c1*i + c2*i²) % m\`. Eliminates primary clustering; may suffer secondary clustering.
    3. Double Hashing: \`h(k, i) = (h1(k) + i * h2(k)) % m\`. Best open addressing method; pseudo-random probe sequence.`,
          algorithmOrCode: `// Complete C Implementation: QuickSort Partition
int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // Pivot as last element
    int i = (low - 1); // Index of smaller element

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
// Time Complexity: O(n log n) average | O(n^2) worst case`,
          keyFormulasOrKeywords: [
            'QuickSort Recurrence: T(n) = 2T(n/2) + O(n)',
            'Worst Case QuickSort: O(n^2) when array sorted',
            'MergeSort Time: Guaranteed O(n log n), Space: O(n)',
            'Load Factor: α = n / m',
            'Linear Probing: (h(k) + i) % m',
            'Quadratic Probing: (h(k) + c1*i + c2*i^2) % m',
            'Double Hashing: (h1(k) + i * h2(k)) % m',
          ],
          diagram: 'generic',
          examBlueprint: {
            blueprint: '1. QuickSort partition algorithm with step-by-step array pointer trace (4 Marks)\n2. Recurrence derivation using Master Theorem (2 Marks)\n3. Separate Chaining vs Open Addressing comparison table (2 Marks)\n4. Linear Probing vs Double Hashing formulas (2 Marks)',
            pitfalls: 'Always state the worst case of QuickSort occurs when the pivot is the smallest or largest element (already sorted array), degrading to O(n²)!',
          },
        },
      ],
    },
    pyqs: [
      {
        id: 'q_dsa_1',
        year: 2025,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Sure Shot ETT',
        isImportant: true,
        unit: 'Unit 3',
        question: 'Explain AVL tree balance factors. Construct an AVL tree by inserting the following sequence: 10, 20, 30, 40, 50, 25. Show rotations clearly.',
        answer: '1. Insert 10, 20: Tree is balanced.\n2. Insert 30: Node 10 has BF = -2 (Right-Right imbalance). Perform Left Rotation on 10 -> 20 becomes root with children 10 and 30.\n3. Insert 40: Balanced.\n4. Insert 50: Node 30 has BF = -2 (RR imbalance). Left rotate 30 -> 40 becomes parent of 30 and 50.\n5. Insert 25: Node 20 has RL imbalance. Right rotate around 40, then Left rotate around 20 -> tree is perfectly balanced!',
      },
      {
        id: 'q_dsa_2',
        year: 2024,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Repeated 3x',
        isImportant: true,
        unit: 'Unit 4',
        question: 'What is a B+ tree? Differentiate between B-Tree and B+ Tree. Why are B+ trees preferred in database indexing?',
        answer: 'Differences:\n1. Data storage: In B-Tree, keys and satellite data records are stored in both internal and leaf nodes. In B+ Tree, data records exist exclusively in leaf nodes; internal nodes only store router keys.\n2. Leaf node linking: In B+ Tree, all leaf nodes are linked together in a doubly linked list, allowing fast O(1) range queries and sequential scans. B-Tree requires expensive in-order tree traversal.\n3. Height: B+ tree has higher fan-out and lower height, resulting in fewer disk I/O operations.',
      },
      {
        id: 'q_dsa_3',
        year: 2025,
        semester: 'Sem 3',
        marks: 5,
        frequency: 'Important',
        isImportant: true,
        unit: 'Unit 5',
        question: 'Write Dijkstra algorithm for single source shortest path. Why does it fail for negative edge weights?',
        answer: 'Algorithm steps:\n1. Initialize dist[src] = 0 and dist[v] = infinity for all other vertices.\n2. Add all vertices to a Priority Queue.\n3. Extract min-distance vertex u. For each neighbor v of u, relax the edge: if dist[u] + weight(u,v) < dist[v], update dist[v] = dist[u] + weight(u,v).\n4. Repeat until priority queue is empty.\n\nNegative weights fail because Dijkstra greedily assumes that once a vertex is marked visited, its shortest distance cannot be decreased. Negative edges violate this greedy property.',
      },
      {
        id: 'q_dsa_4',
        year: 2025,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Compulsory 10M',
        isImportant: true,
        unit: 'Unit 1',
        question: 'Convert the following infix expression into postfix using stack: A + (B * C - (D / E ^ F) * G) * H. Show stack trace table.',
        answer: 'Trace Table Columns: Symbol | Stack | Output\n1. A: Output = A\n2. +: Stack = [+]\n3. (: Stack = [+, (]\n4. B: Output = A B\n5. *: Stack = [+, (, *]\n6. C: Output = A B C\n7. -: Stack = [+, (, -], Output = A B C *\n8. (: Stack = [+, (, -, (]\n9. D: Output = A B C * D\n10. /: Stack = [+, (, -, (, /]\n11. E: Output = A B C * D E\n12. ^: Stack = [+, (, -, (, /, ^]\n13. F: Output = A B C * D E F\n14. ): Pop ^, /, discard ( -> Stack = [+, (, -], Output = A B C * D E F ^ /\n15. *: Stack = [+, (, -, *]\n16. G: Output = A B C * D E F ^ / G\n17. ): Pop *, - -> Stack = [+], Output = A B C * D E F ^ / G * -\n18. *: Stack = [+, *]\n19. H: Output = A B C * D E F ^ / G * - H\n20. End: Pop *, + -> Final Output = A B C * D E F ^ / G * - H * +.',
      },
      {
        id: 'q_dsa_5',
        year: 2025,
        semester: 'Sem 3',
        marks: 5,
        frequency: 'Repeated MTT/ETT',
        isImportant: true,
        unit: 'Unit 2',
        question: 'What is the "False Overflow" problem in linear queues? How does Circular Queue solve it using modulo arithmetic?',
        answer: 'False Overflow occurs when elements are repeatedly inserted and deleted. Even if earlier slots (0 to front-1) are empty, rear == MAX-1 makes the queue report overflow.\nCircular Queue solves this by wrapping indices circularly:\n- Rear = (Rear + 1) % MAX;\n- Front = (Front + 1) % MAX;\nFull condition is ((Rear + 1) % MAX == Front), enabling 100% array memory utilization!',
      },
      {
        id: 'q_dsa_6',
        year: 2024,
        semester: 'Sem 3',
        marks: 10,
        frequency: 'Repeated 4x',
        isImportant: true,
        unit: 'Unit 6',
        question: 'Explain QuickSort partition algorithm with step-by-step example. What are its best and worst case time complexities?',
        answer: '1. Partition Algorithm: Lomuto / Hoare method places chosen pivot into its exact final sorted position such that all elements on left <= pivot and right >= pivot.\n2. Best/Average Case: O(n log n) when pivot divides array into two roughly equal halves: T(n) = 2T(n/2) + O(n).\n3. Worst Case: O(n^2) when array is already sorted and first/last element is pivot, causing skewed partitions: T(n) = T(n-1) + O(n).',
      },
    ],
    notes: [
      {
        id: 'n_dsa_1',
        title: 'Master Theorem for Divide & Conquer Recurrences',
        content: 'For T(n) = a*T(n/b) + f(n):\nCompare f(n) with n^(log_b(a)):\n- Case 1: If f(n) < n^(log_b(a)), T(n) = Theta(n^(log_b(a))).\n- Case 2: If f(n) == n^(log_b(a)), T(n) = Theta(n^(log_b(a)) * log n).\n- Case 3: If f(n) > n^(log_b(a)), T(n) = Theta(f(n)).',
      },
    ],
  },
];

function resolveEnrichedUnit(unit, index, subject = '') {
  if (!unit) return null;
  const unitName = unit.unit || `Unit ${index + 1}`;
  const title = unit.title || `${unitName}: Core Concepts & Architecture`;
  const analogy = unit.analogy || `Real-World Intuition: ${title} is designed to solve fundamental computational bottlenecks in ${subject || 'computer science'}.`;
  const simpleExplanation = unit.simpleExplanation || unit.summary || 'Comprehensive university revision concepts and operational guidelines.';
  const coreTheory = unit.coreTheory || `### 1. Conceptual Framework & Definitions
• ${simpleExplanation.replace(/\\n/g, '\\n• ')}

### 2. Operational Invariants & Mechanism
• Systematic breakdown of algorithms and architectural trade-offs.
• Memory representations, pointers, and traversal workflows.
• Boundary conditions and edge case safety validations.

### 3. Comparison & Trade-off Analysis
• Space and Time complexity efficiency proofs.
• Contrast with alternative data models and traditional approaches.`;

  const algorithmOrCode = unit.algorithmOrCode || `// Practical Implementation / Algorithmic Workflow for ${unitName}
// Step 1: Initialize data structure and allocate memory
// Step 2: Validate boundary conditions and edge cases
// Step 3: Perform core state transformations
// Step 4: Return result and maintain invariants
// Time Complexity: O(log n) to O(n) | Space Complexity: O(1) auxiliary`;

  const keyFormulasOrKeywords = (unit.keyFormulasOrKeywords && unit.keyFormulasOrKeywords.length > 0)
    ? unit.keyFormulasOrKeywords
    : [
        `${unitName} Core Invariant`,
        'Asymptotic Efficiency: O(log n) to O(n)',
        'Boundary Safety Checks',
        'Algorithmic State Transitions',
      ];

  const examBlueprint = unit.examBlueprint || {
    blueprint: `1. Definition, Architecture & Diagrams (2 Marks)\\n2. Core Mathematical / Algorithmic Mechanics (4 Marks)\\n3. Working Implementation / Pseudocode (2 Marks)\\n4. Complexity Analysis & Real Applications (2 Marks)`,
    pitfalls: `Always draw neat architectural diagrams and mention boundary condition checks to secure full 10/10 university marks.`,
  };

  const diagram = unit.diagram || 'generic';

  return {
    ...unit,
    unit: unitName,
    title,
    analogy,
    simpleExplanation,
    coreTheory,
    algorithmOrCode,
    keyFormulasOrKeywords,
    examBlueprint,
    diagram,
  };
}

export default function ExamPrepPage() {
  const { addNote, addTask, subjects, assignments, addAssignment, updateAssignment, deleteAssignment } = useStudy();

  const [meta, setMeta] = useState({ universities: [], courses: [], semesters: [], examTypes: [], subjects: [], subjectCatalog: [] });
  const [filters, setFilters] = useState({
    course: '',
    semester: 'All Semesters',
    university: '',
    college: '',
    examType: 'End Term Test (ETT)',
    subject: '',
    search: '',
  });

  const [packs, setPacks] = useState([]);
  const [matchMode, setMatchMode] = useState('exact');
  const [selectedPackId, setSelectedPackId] = useState('');
  const [activeTab, setActiveTab] = useState('units');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [unitSubView, setUnitSubView] = useState('all'); // 'all' | 'intuition' | 'theory' | 'diagram' | 'code' | 'formulas' | 'blueprint' | 'pyqs' | 'assignments'
  const [assignmentUnitFilter, setAssignmentUnitFilter] = useState('All Units');
  const [yearFilter, setYearFilter] = useState('All');
  const [marksFilter, setMarksFilter] = useState('All');
  const [importantOnly, setImportantOnly] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [expandedPyqIds, setExpandedPyqIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const [progress, setProgress] = useState({
    revisedQuestionIds: [],
    bookmarkedQuestionIds: [],
  });

  // Modals
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [packForm, setPackForm] = useState({
    university: '', college: '', course: 'B.Tech CSE', semester: 'Sem 3', subject: '', examType: 'End Term Test (ETT)',
  });

  const [contributeModal, setContributeModal] = useState(null); // 'pyq' | 'note' | null
  const [pyqForm, setPyqForm] = useState({
    year: 2025, marks: 10, section: 'Section B', unit: 'Unit 1', frequency: 'Important', question: '', answer: '', examTip: '',
  });
  const [noteForm, setNoteForm] = useState({
    unit: 'Unit 1', title: '', summary: '', keyPoints: '',
  });

  // Unit Assignment Modal
  const [unitAssignmentModalOpen, setUnitAssignmentModalOpen] = useState(false);
  const [unitAssignmentForm, setUnitAssignmentForm] = useState({
    title: '', unit: 'Unit 1', subjectId: '', dueDate: '', priority: 'Medium', description: '',
  });

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleOpenUnitAssignmentModal = (unitName) => {
    const curSub = subjects.find(
      (s) =>
        s.name?.toLowerCase().includes((activePack?.subject || '').toLowerCase()) ||
        (activePack?.subject || '').toLowerCase().includes((s.name || '').toLowerCase())
    ) || subjects[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDueDate = nextWeek.toISOString().slice(0, 10);

    setUnitAssignmentForm({
      title: '',
      unit: unitName || `Unit ${selectedUnitIndex + 1}`,
      subjectId: curSub?.id || '',
      dueDate: defaultDueDate,
      priority: 'Medium',
      description: '',
    });
    setUnitAssignmentModalOpen(true);
  };

  const handleSaveUnitAssignment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!unitAssignmentForm.title.trim()) {
      showNotice('Please enter an assignment title');
      return;
    }
    try {
      await addAssignment({
        title: unitAssignmentForm.title.trim(),
        unit: unitAssignmentForm.unit || `Unit ${selectedUnitIndex + 1}`,
        subjectId: unitAssignmentForm.subjectId || null,
        dueDate: unitAssignmentForm.dueDate || '',
        priority: unitAssignmentForm.priority || 'Medium',
        status: 'Pending',
        description: unitAssignmentForm.description || '',
      });
      setUnitAssignmentModalOpen(false);
      showNotice(`✓ Added assignment for ${unitAssignmentForm.unit || 'Unit'} successfully!`);
    } catch (err) {
      showNotice('Failed to create assignment: ' + err.message);
    }
  };

  const fetchMetaAndProgress = useCallback(async () => {
    try {
      const [metaRes, progRes] = await Promise.all([
        apiFetch('/examprep/meta'),
        apiFetch('/examprep/progress'),
      ]);
      if (metaRes?.data) setMeta(metaRes.data);
      if (progRes?.data) {
        setProgress({
          revisedQuestionIds: progRes.data.revisedQuestionIds || [],
          bookmarkedQuestionIds: progRes.data.bookmarkedQuestionIds || [],
        });
        setFilters((prev) => ({
          ...prev,
          course: progRes.data.course || prev.course,
          semester: progRes.data.semester || prev.semester,
          university: progRes.data.university || prev.university,
          college: progRes.data.college || prev.college,
          examType: progRes.data.examType || prev.examType,
        }));
      }
    } catch (e) {
      console.warn('Failed to load Exam Prep metadata, using demo metadata', e);
      setMeta(DEMO_FALLBACK_META);
    }
  }, []);

  const fetchPacks = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilters.course.trim()) params.set('course', activeFilters.course.trim());
      if (activeFilters.semester && activeFilters.semester !== 'All Semesters') {
        params.set('semester', activeFilters.semester);
      }
      if (activeFilters.university.trim()) params.set('university', activeFilters.university.trim());
      if (activeFilters.college.trim()) params.set('college', activeFilters.college.trim());
      if (activeFilters.examType && activeFilters.examType !== 'All Exam Types') {
        params.set('examType', activeFilters.examType);
      }
      if (activeFilters.subject.trim()) params.set('subject', activeFilters.subject.trim());
      if (activeFilters.search.trim()) params.set('search', activeFilters.search.trim());

      const res = await apiFetch(`/examprep?${params.toString()}`);
      const list = res.data || [];
      if (list.length === 0) {
        setPacks(DEMO_FALLBACK_PACKS);
        setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
      } else {
        setPacks(list);
        setMatchMode(res.matchMode || 'exact');
        const pickFirst = activeFilters.subject.trim() || activeFilters.search.trim();
        setSelectedPackId((prev) => (!pickFirst && list.some((p) => p.id === prev) ? prev : (list[0]?.id || '')));
      }
    } catch (e) {
      console.warn('Failed to fetch study packs, falling back to demo pack', e);
      setPacks(DEMO_FALLBACK_PACKS);
      setMatchMode('demo');
      setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [metaRes, progRes] = await Promise.all([
          apiFetch('/examprep/meta'),
          apiFetch('/examprep/progress'),
        ]);
        if (!mounted) return;
        if (metaRes?.data) setMeta(metaRes.data);
        const p = progRes?.data || {};
        setProgress({
          revisedQuestionIds: p.revisedQuestionIds || [],
          bookmarkedQuestionIds: p.bookmarkedQuestionIds || [],
        });
        const initialFilters = {
          course: p.course || '',
          semester: p.semester || 'All Semesters',
          university: p.university || '',
          college: p.college || '',
          examType: p.examType || 'End Term Test (ETT)',
          subject: '',
          search: '',
        };
        setFilters(initialFilters);
        await fetchPacks(initialFilters);
      } catch (e) {
        console.warn('Failed to initialize Exam Prep Hub from backend, using demo data', e);
        if (mounted) {
          setMeta(DEMO_FALLBACK_META);
          setPacks(DEMO_FALLBACK_PACKS);
          setSelectedPackId(DEMO_FALLBACK_PACKS[0]?.id || '');
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [fetchPacks]);

  const handleApplyFilters = async (e, overrideFilters) => {
    if (e) e.preventDefault();
    const next = overrideFilters || filters;
    setYearFilter('All');
    setMarksFilter('All');
    await fetchPacks(next);
    try {
      await apiFetch('/examprep/progress', {
        method: 'PUT',
        body: JSON.stringify({
          course: next.course,
          semester: next.semester,
          university: next.university,
          college: next.college,
          examType: next.examType,
        }),
      });
    } catch {}
  };

  const handleQuickCourse = (c) => {
    const next = {
      ...filters,
      course: filters.course === c ? '' : c,
      subject: '',
      examType: c.includes('ETT') ? 'ETT Board Exam' : filters.examType,
    };
    setFilters(next);
    handleApplyFilters(null, next);
  };

  const activePack = packs.find((p) => p.id === selectedPackId) || packs[0] || null;

  const toggleAnswer = (qId) => {
    setExpandedPyqIds((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleProgressItem = async (field, qId) => {
    const currentList = progress[field] || [];
    const exists = currentList.includes(qId);
    const updatedList = exists ? currentList.filter((id) => id !== qId) : [...currentList, qId];
    setProgress((prev) => ({ ...prev, [field]: updatedList }));
    try {
      await apiFetch('/examprep/progress', {
        method: 'PUT',
        body: JSON.stringify({ [field]: updatedList }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveUnitToNotes = async (unitNote) => {
    if (!activePack) return;
    const bulletText = (unitNote.keyPoints || []).map((k) => `• ${k}`).join('\n');
    const content = `[${activePack.course} • ${activePack.university} • ${unitNote.unit}]\n\n${unitNote.summary}${bulletText ? `\n\nKey Revision Points:\n${bulletText}` : ''}`;
    await addNote({
      title: `${activePack.subject}: ${unitNote.title}`,
      subject: activePack.subject,
      content,
    });
    showNotice(`Saved "${unitNote.title}" to My Notes`);
  };

  const handleSaveCrashSummaryToNotes = async () => {
    if (!activePack?.crashSummary) return;
    const cs = activePack.crashSummary;
    const body = [
      cs.tagline,
      cs.passPlan ? `\nOne-Night Passing Plan:\n${cs.passPlan}` : '',
      ...(cs.units || []).map((u) => `\n--- ${u.unit}: ${u.title} ---\nAnalogy: ${u.analogy}\n${u.simpleExplanation}\nKey Formulas/Keywords: ${(u.keyFormulasOrKeywords || []).join(' | ')}`),
    ].filter(Boolean).join('\n');

    await addNote({
      title: `${activePack.subject} — Complete All-Unit Crash Summary`,
      subject: activePack.subject,
      content: body,
    });
    showNotice('Saved complete All-Unit Summary to My Notes');
  };

  const handleCreateTaskFromPyq = async (label) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const matchingSubject = subjects.find((s) =>
      activePack?.subject?.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes((activePack?.subject || '').toLowerCase())
    );
    await addTask({
      name: `Revise: ${label.slice(0, 120)}`,
      subjectId: matchingSubject?.id || '',
      priority: 'High',
      deadline: todayStr,
      estHours: 1.5,
      status: 'Pending',
    });
    showNotice('Added revision item to Tasks');
  };

  const handleCreatePack = async () => {
    if (!packForm.university.trim() || !packForm.course.trim() || !packForm.subject.trim()) return;
    try {
      const res = await apiFetch('/examprep', {
        method: 'POST',
        body: JSON.stringify(packForm),
      });
      setPackModalOpen(false);
      const nextFilters = {
        ...filters,
        university: packForm.university,
        college: packForm.college,
        course: packForm.course,
        examType: packForm.examType,
        subject: packForm.subject,
      };
      setFilters(nextFilters);
      await fetchMetaAndProgress();
      await fetchPacks(nextFilters);
      if (res?.data?.id) setSelectedPackId(res.data.id);
      showNotice('Created custom University & Course pack');
    } catch (e) {
      console.error(e);
    }
  };

  const handleContributeSubmit = async () => {
    if (!activePack) return;
    try {
      let targetPackId = activePack.id;
      if (activePack.isVirtualStarter) {
        const created = await apiFetch('/examprep', {
          method: 'POST',
          body: JSON.stringify({
            university: activePack.university,
            college: activePack.college || '',
            course: activePack.course,
            semester: activePack.semester || 'All Semesters',
            subject: activePack.subject,
            examType: activePack.examType,
          }),
        });
        targetPackId = created?.data?.id;
      }
      if (!targetPackId) return;

      if (contributeModal === 'pyq') {
        if (!pyqForm.question.trim() || !pyqForm.answer.trim()) return;
        const res = await apiFetch(`/examprep/${targetPackId}/pyq`, {
          method: 'POST',
          body: JSON.stringify(pyqForm),
        });
        setPyqForm({ year: 2025, marks: 10, section: 'Section B', unit: 'Unit 1', frequency: 'Important', question: '', answer: '', examTip: '' });
        await fetchPacks(filters);
        if (res?.data?.id) setSelectedPackId(res.data.id);
        showNotice('Added Previous Year Question & Answer');
      } else if (contributeModal === 'note') {
        if (!noteForm.title.trim() || !noteForm.summary.trim()) return;
        const res = await apiFetch(`/examprep/${targetPackId}/note`, {
          method: 'POST',
          body: JSON.stringify(noteForm),
        });
        setNoteForm({ unit: 'Unit 1', title: '', summary: '', keyPoints: '' });
        await fetchPacks(filters);
        if (res?.data?.id) setSelectedPackId(res.data.id);
        showNotice('Added Unit Note');
      }
      setContributeModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePack = async (packId) => {
    try {
      await apiFetch(`/examprep/${packId}`, { method: 'DELETE' });
      await fetchPacks(filters);
      showNotice('Removed custom study pack');
    } catch (e) {
      console.error(e);
    }
  };

  const totalNotesCount = packs.reduce((acc, p) => acc + (p.notes?.length || 0), 0);
  const totalPyqsCount = packs.reduce((acc, p) => acc + (p.pyqs?.length || 0), 0);
  const activePyqs = activePack?.pyqs || [];
  const activeNotes = activePack?.notes || [];
  const revisedInActive = activePyqs.filter((q) => progress.revisedQuestionIds.includes(q.id)).length;
  const availableYears = ['All', ...new Set(activePyqs.map((q) => String(q.year)))].sort((a, b) => (a === 'All' ? -1 : b.localeCompare(a)));
  const availableMarks = ['All', ...new Set(activePyqs.map((q) => Number(q.marks)).filter(Boolean)).values()]
    .sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a - b))
    .map(String);

  const qSearch = filters.search.trim().toLowerCase();
  const searchTargetsPack =
    qSearch &&
    activePack &&
    (activePack.subject.toLowerCase().includes(qSearch) ||
      qSearch.split(/\s+/).some((w) => w.length >= 3 && activePack.subject.toLowerCase().includes(w)) ||
      activePack.course.toLowerCase().includes(qSearch) ||
      activePack.university.toLowerCase().includes(qSearch));

  const filteredPyqs = activePyqs
    .filter((q) => {
      const matchYear = yearFilter === 'All' || String(q.year) === yearFilter;
      const matchMarks = marksFilter === 'All' || String(q.marks) === marksFilter;
      const isImp = q.isImportant !== false && /repeated|important|mtt|ett|sure/i.test(q.frequency || 'Important');
      const matchImportant = !importantOnly || isImp;
      const matchBookmark = !bookmarkedOnly || progress.bookmarkedQuestionIds.includes(q.id);
      const matchText = !qSearch || searchTargetsPack || q.question.toLowerCase().includes(qSearch) || q.answer.toLowerCase().includes(qSearch);
      return matchYear && matchMarks && matchImportant && matchBookmark && matchText;
    })
    .sort((a, b) => {
      const impA = a.isImportant !== false ? 1 : 0;
      const impB = b.isImportant !== false ? 1 : 0;
      if (impB !== impA) return impB - impA;
      return Number(b.marks || 0) - Number(a.marks || 0);
    });

  const normalizedCourseVal = normalizeCourseMatch(filters.course);
  const catalogForSelection = (meta.subjectCatalog || []).filter((item) => {
    const matchC = !normalizedCourseVal || item.course.toLowerCase() === normalizedCourseVal.toLowerCase();
    const matchS = !filters.semester || filters.semester === 'All Semesters' || item.semester === filters.semester;
    return matchC && matchS;
  });
  const selectableSubjectChips = [...new Set(catalogForSelection.map((i) => i.subject))];

  const allExpanded = filteredPyqs.length > 0 && filteredPyqs.every((q) => !!expandedPyqIds[q.id]);
  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedPyqIds({});
    } else {
      const next = { ...expandedPyqIds };
      filteredPyqs.forEach((q) => { next[q.id] = true; });
      setExpandedPyqIds(next);
    }
  };

  return (
    <div>
      <div className="page-head flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-eyebrow">University & ETT Exam Bank</div>
          <div className="page-title">Exam Prep Hub</div>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {activePack && (
            <>
              <button className="btn btn-ghost" onClick={() => setContributeModal('note')}><LuFileText size={14} /> Add Note</button>
              <button className="btn btn-ghost" onClick={() => setContributeModal('pyq')}><LuPlus size={14} /> Add PYQ & Answer</button>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setPackModalOpen(true)}><LuGraduationCap size={15} /> New University Pack</button>
        </div>
      </div>

      {feedback && (
        <div className="panel panel-pad mb-4 fade-in" style={{ background: 'var(--sage-wash)', borderColor: 'var(--sage)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--sage-deep)' }}>{feedback}</div>
        </div>
      )}

      {/* Course, Semester, University/College & ETT Exam Selector */}
      <form onSubmit={(e) => handleApplyFilters(e)} className="panel panel-pad mb-6">
        <div className="grid grid-3 mb-3">
          <div className="field">
            <label className="field-label">Your Course / Stream</label>
            <input
              list="course-options"
              className="field-input"
              placeholder="e.g. B.Tech CSE, BCA, ETT / D.El.Ed"
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value, subject: '' })}
            />
            <datalist id="course-options">
              {meta.courses.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div className="field">
            <label className="field-label">Semester</label>
            <select
              className="field-input"
              value={filters.semester}
              onChange={(e) => {
                const next = { ...filters, semester: e.target.value, subject: '' };
                setFilters(next);
                handleApplyFilters(null, next);
              }}
            >
              {SEMESTER_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">University / College</label>
            <input
              list="univ-options"
              className="field-input"
              placeholder="e.g. CT University, AKTU, DU, SPPU"
              value={filters.university}
              onChange={(e) => setFilters({ ...filters, university: e.target.value })}
            />
            <datalist id="univ-options">
              {meta.universities.map((u) => <option key={u} value={u} />)}
            </datalist>
          </div>
        </div>

        <div className="grid grid-2 mb-4">
          <div className="field">
            <label className="field-label">Exam Pattern / ETT</label>
            <select
              className="field-input"
              value={filters.examType}
              onChange={(e) => {
                const next = { ...filters, examType: e.target.value };
                setFilters(next);
                handleApplyFilters(null, next);
              }}
            >
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Subject / Topic Search</label>
            <SearchInput
              value={filters.search}
              onChange={(val) => setFilters({ ...filters, search: val, subject: '' })}
              placeholder="e.g. Machine Learning, Discrete Structures, DBMS..."
            />
          </div>
        </div>

        {selectableSubjectChips.length > 0 && (
          <div className="mb-4" style={{ padding: '12px 14px', background: 'var(--paper)', borderRadius: 12, border: '1px solid var(--line)' }}>
            <div className="text-xs font-bold muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Select Subject ({filters.semester !== 'All Semesters' ? filters.semester : 'All Semesters'}) — then click Find Notes & PYQs
            </div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {selectableSubjectChips.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  className={`btn btn-sm ${filters.subject === subj ? 'btn-accent' : 'btn-ghost'}`}
                  onClick={() => setFilters((prev) => ({
                    ...prev,
                    subject: prev.subject === subj ? '' : subj,
                    search: '',
                  }))}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
            <span className="text-xs font-semibold muted">Quick Courses:</span>
            {QUICK_COURSES.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${filters.course === c ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => handleQuickCourse(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const reset = { course: '', semester: 'All Semesters', university: '', college: '', examType: 'All Exam Types', subject: '', search: '' };
                setFilters(reset);
                handleApplyFilters(null, reset);
              }}
            >
              Show All
            </button>
            <button type="submit" className="btn btn-primary btn-sm"><LuSparkles size={13} /> Find Notes & PYQs</button>
          </div>
        </div>
      </form>

      {/* Summary Stats */}
      <div className="grid grid-4 mb-6">
        <StatCard label="Matched Subjects" value={packs.length} icon={LuLayers} accent="amber" />
        <StatCard label="Unit Study Notes" value={totalNotesCount} icon={LuFileText} accent="slate" />
        <StatCard label="Solved PYQs" value={totalPyqsCount} icon={LuBookOpenCheck} accent="coral" />
        <StatCard
          label="Revised in Subject"
          value={`${revisedInActive}/${activePyqs.length}`}
          icon={LuCheck}
          accent="sage"
          sub={activePyqs.length ? `${Math.round((revisedInActive / activePyqs.length) * 100)}% exam ready` : 'Select a subject'}
        />
      </div>

      {/* Match Banner when adapted for custom college/university */}
      {activePack?.adaptedInfo && (
        <div className="panel panel-pad mb-6" style={{ background: 'var(--amber-wash)', borderColor: 'var(--amber)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--amber-deep)' }}>
            Adapted for {activePack.adaptedInfo.requestedUniversity} • {activePack.adaptedInfo.requestedCourse} ({activePack.adaptedInfo.requestedExamType})
          </div>
          <div className="text-xs soft mt-2">
            Showing verified core syllabus notes, solved PYQs, and tailored exam blueprint. You can also click "New University Pack" or "Add PYQ & Answer" to save your college's exact paper!
          </div>
        </div>
      )}

      {loading ? (
        <div className="panel panel-pad text-sm muted">Loading university notes and previous year papers...</div>
      ) : packs.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon="🎓"
            title="No matching study pack found"
            description="Clear filters or create a custom pack for your university and course."
            action={<button className="btn btn-primary" onClick={() => setPackModalOpen(true)}><LuPlus size={14} /> Create Custom Pack</button>}
          />
        </div>
      ) : (
        <>
          {/* Subject Pack Switcher */}
          <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedPackId(p.id); setYearFilter('All'); setMarksFilter('All'); }}
                className={`btn btn-sm ${activePack?.id === p.id ? 'btn-primary' : 'btn-ghost'}`}
              >
                <span>{p.subject}</span>
                <span className="text-xs" style={{ opacity: 0.75 }}>({p.course})</span>
              </button>
            ))}
          </div>

          {activePack && (
            <div>
              {/* Active Pack Header */}
              <div className="panel panel-pad mb-6">
                <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div className="flex gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                      <Pill tone="amber">{activePack.course}</Pill>
                      <Pill tone="slate">{activePack.university}</Pill>
                      <Pill tone="coral">{activePack.examType}</Pill>
                      <Pill tone="sage">{activePack.semester}</Pill>
                    </div>
                    <h2 style={{ fontSize: 22 }}>{activePack.subject}</h2>
                    <div className="text-xs muted mt-2">
                      {activeNotes.length} Unit Notes • {activePyqs.length} Solved PYQs • {activePack.examPattern?.totalMarks || 70} Marks ({activePack.examPattern?.duration || '3 Hours'})
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!activePack.isGlobal && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeletePack(activePack.id)}>
                        <LuTrash2 size={13} /> Delete Custom Pack
                      </button>
                    )}
                  </div>
                </div>
                {activePyqs.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="muted">Subject PYQ Mastery</span>
                      <span className="font-semibold">{revisedInActive} of {activePyqs.length} revised</span>
                    </div>
                    <ProgressBar value={revisedInActive} max={activePyqs.length} color="var(--sage)" />
                  </div>
                )}
              </div>

              {/* DERIVED UNIT DATA & MULTI-PAGE MASTER EXPANSION */}
              {(() => {
                const activeUnits = (activePack.crashSummary?.units && activePack.crashSummary.units.length > 0)
                  ? activePack.crashSummary.units
                  : (activePack.notes && activePack.notes.length > 0)
                    ? activePack.notes.map((n, i) => ({
                        unit: n.unit || `Unit ${i + 1}`,
                        title: n.title,
                        analogy: `Real-World Intuition: ${n.title} is designed to solve critical system and computational bottlenecks in ${activePack.subject}.`,
                        simpleExplanation: n.summary,
                        coreTheory: n.summary,
                        keyFormulasOrKeywords: n.keyPoints || [],
                        diagram: n.diagram || n.title || activePack.subject,
                      }))
                    : [
                        { unit: 'Unit 1', title: 'Foundational Principles & Core Architecture' },
                        { unit: 'Unit 2', title: 'Operational Mechanisms & Procedures' },
                        { unit: 'Unit 3', title: 'Analytical Models & Mathematical Foundations' },
                        { unit: 'Unit 4', title: 'Advanced Structures & Balance Invariants' },
                        { unit: 'Unit 5', title: 'Algorithmic Optimization & System Workflows' },
                        { unit: 'Unit 6', title: 'Testing, Complexity & Problem Solving' },
                      ];

                const safeUnitIndex = Math.min(Math.max(0, selectedUnitIndex), Math.max(0, activeUnits.length - 1));
                const currentUnit = activeUnits[safeUnitIndex] || activeUnits[0];
                const enrichedUnit = resolveEnrichedUnit(currentUnit, safeUnitIndex, activePack.subject);

                const unitPyqs = activePyqs.filter(
                  (q) =>
                    (q.unit || '').trim().toLowerCase() === currentUnit.unit.trim().toLowerCase() ||
                    (safeUnitIndex === 0 && (!q.unit || q.unit.toLowerCase() === 'general'))
                );

                const unitAssignments = assignments.filter((a) => {
                  const targetUnit = currentUnit.unit.trim().toLowerCase();
                  const aUnit = (a.unit || '').trim().toLowerCase();
                  return aUnit === targetUnit || (safeUnitIndex === 0 && (!a.unit || a.unit.toLowerCase() === 'general'));
                });

                const crossUnitAssignments = assignments.filter((a) => {
                  if (assignmentUnitFilter === 'All Units') return true;
                  return (a.unit || 'Unit 1').toLowerCase() === assignmentUnitFilter.toLowerCase();
                });

                return (
                  <>
                    <Tabs
                      tabs={[
                        { label: 'Units 1–6 Master Notes', value: 'units', count: activeUnits.length },
                        { label: 'Previous Year Q&A (PYQs)', value: 'pyqs', count: activePyqs.length },
                        { label: 'Unit Assignments Tracker', value: 'assignments', count: assignments.length },
                        { label: 'ETT & Exam Pattern', value: 'pattern' },
                      ]}
                      active={activeTab}
                      onChange={setActiveTab}
                    />

                    {/* TAB: UNITS 1 TO 6 MASTER NOTES (SEPARATE 2-3 PAGE IN-DEPTH GUIDES) */}
                    {activeTab === 'units' && (
                      <div className="flex flex-col gap-4">
                        {/* Unit Switcher Bar */}
                        <div className="panel panel-pad">
                          <div className="flex justify-between items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
                            <div>
                              <div className="text-xs font-bold muted" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>
                                Unit Master Selector (Units 1 to 6 — 2 to 3 Pages Deep Per Unit)
                              </div>
                              <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>
                                Active: <span style={{ color: 'var(--amber-deep)' }}>{enrichedUnit.unit}</span> — {enrichedUnit.title}
                              </div>
                            </div>
                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenUnitAssignmentModal(enrichedUnit.unit)}
                              >
                                <LuPlus size={13} /> Add Assignment for {enrichedUnit.unit}
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleSaveUnitToNotes({
                                  unit: enrichedUnit.unit,
                                  title: enrichedUnit.title,
                                  summary: `${enrichedUnit.analogy}\n\n${enrichedUnit.simpleExplanation}`,
                                  keyPoints: enrichedUnit.keyFormulasOrKeywords,
                                })}
                              >
                                <LuCopy size={13} /> Save Unit to Notes
                              </button>
                            </div>
                          </div>

                          {/* Horizontal Unit Switcher (Unit 1 to 6) */}
                          <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                            {activeUnits.map((u, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className={`btn ${safeUnitIndex === idx ? 'btn-primary' : 'btn-ghost'}`}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  padding: '8px 14px',
                                  borderRadius: 10,
                                  textAlign: 'left',
                                  flex: '1 1 140px',
                                  minWidth: 120,
                                }}
                                onClick={() => { setSelectedUnitIndex(idx); setUnitSubView('all'); }}
                              >
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{u.unit}</span>
                                <span className="text-xs" style={{ opacity: 0.8, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {u.title.replace(/^Unit \d+:\s*/i, '')}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Multi-Section Sub-Navigation */}
                          <div className="flex gap-1.5 items-center pt-3" style={{ borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                            <span className="text-xs font-semibold muted" style={{ marginRight: 4 }}>Jump to Section:</span>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'all' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('all')}
                            >
                              📖 Full 3-Page Master Guide
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'intuition' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('intuition')}
                            >
                              🌟 1. Real-Life Intuition
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'theory' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('theory')}
                            >
                              📚 2. Deep Theory & Concepts
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'code' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('code')}
                            >
                              💻 3. Code & Implementation
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'formulas' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('formulas')}
                            >
                              ⚡ 4. Formulas & Keywords
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'blueprint' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('blueprint')}
                            >
                              🏆 5. 10-Mark Blueprint
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'pyqs' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('pyqs')}
                            >
                              📝 6. Solved PYQs ({unitPyqs.length})
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${unitSubView === 'assignments' ? 'btn-accent' : 'btn-ghost'}`}
                              style={{ fontSize: 11.5, padding: '4px 10px' }}
                              onClick={() => setUnitSubView('assignments')}
                            >
                              📋 7. Unit Assignments ({unitAssignments.length})
                            </button>
                          </div>
                        </div>

                        {/* PART 1: REAL-LIFE INTUITION & ANALOGY */}
                        {(unitSubView === 'all' || unitSubView === 'intuition') && (
                          <div className="panel panel-pad fade-in" style={{ background: 'var(--sage-wash)', borderColor: 'var(--sage)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <span style={{ fontSize: 18 }}>🌟</span>
                              <span className="font-bold text-sm" style={{ color: 'var(--sage-deep)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                                Asan Bhasha Mein Samjhein — Real-Life Intuition & Analogy
                              </span>
                            </div>
                            <p className="text-sm" style={{ lineHeight: 1.8, color: 'var(--ink)' }}>
                              {enrichedUnit.analogy}
                            </p>
                          </div>
                        )}

                        {/* PART 2: COMPREHENSIVE CORE THEORY & CONCEPTS (2-3 PAGES DEPTH) */}
                        {(unitSubView === 'all' || unitSubView === 'theory') && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 18 }}>📚</span>
                                <h3 style={{ fontSize: 18 }}>Comprehensive Core Theory & Detailed Breakdown</h3>
                              </div>
                              <Pill tone="amber">{enrichedUnit.unit} Master Theory</Pill>
                            </div>
                            <div className="text-sm soft" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.85 }}>
                              {enrichedUnit.coreTheory}
                            </div>
                          </div>
                        )}

                        {/* PART 3: VISUAL CONCEPT ARCHITECTURE & VECTOR FLOW */}
                        {(unitSubView === 'all' || unitSubView === 'diagram' || unitSubView === 'theory') && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex items-center gap-2 mb-3">
                              <span style={{ fontSize: 18 }}>🎨</span>
                              <h3 style={{ fontSize: 17 }}>Visual Concept Architecture & Vector Flow</h3>
                            </div>
                            <VisualDiagram
                              type={enrichedUnit.diagram || enrichedUnit.title || activePack.subject}
                              title={`${enrichedUnit.unit}: ${enrichedUnit.title}`}
                              caption={`Vector illustration showing architectural dataflow and node transitions for ${enrichedUnit.title}`}
                            />
                          </div>
                        )}

                        {/* PART 4: STEP-BY-STEP PRACTICAL IMPLEMENTATION / CODE & ALGORITHMS */}
                        {(unitSubView === 'all' || unitSubView === 'code') && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 18 }}>💻</span>
                                <h3 style={{ fontSize: 17 }}>Algorithmic Implementation & Working Code</h3>
                              </div>
                              <div className="flex gap-2">
                                <Pill tone="sage">O(1) to O(N)</Pill>
                                <Pill tone="slate">Exam Ready Code</Pill>
                              </div>
                            </div>
                            <pre style={{
                              background: '#1E293B',
                              color: '#F8FAFC',
                              padding: '16px',
                              borderRadius: 10,
                              overflowX: 'auto',
                              fontSize: 12.5,
                              lineHeight: 1.65,
                              fontFamily: 'Consolas, Monaco, monospace'
                            }}>
                              <code>{enrichedUnit.algorithmOrCode}</code>
                            </pre>
                          </div>
                        )}

                        {/* PART 5: MUST-REMEMBER FORMULAS & KEYWORD CHEATSHEET */}
                        {(unitSubView === 'all' || unitSubView === 'formulas') && enrichedUnit.keyFormulasOrKeywords?.length > 0 && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex items-center gap-2 mb-3">
                              <span style={{ fontSize: 18 }}>⚡</span>
                              <h3 style={{ fontSize: 17 }}>Must-Remember Formulas, Theorems & Keyword Cheatsheet</h3>
                            </div>
                            <div className="grid grid-2" style={{ gap: 10 }}>
                              {enrichedUnit.keyFormulasOrKeywords.map((kw, kIdx) => (
                                <div key={kIdx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 14px' }}>
                                  <span className="mono text-xs font-bold" style={{ color: 'var(--amber-deep)', marginRight: 6 }}>#{kIdx + 1}</span>
                                  <span className="text-xs font-semibold">{kw}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* PART 6: 10-MARK UNIVERSITY ANSWER BLUEPRINT & COMMON PITFALLS */}
                        {(unitSubView === 'all' || unitSubView === 'blueprint') && enrichedUnit.examBlueprint && (
                          <div className="panel panel-pad fade-in" style={{ borderLeft: '4px solid var(--amber)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <span style={{ fontSize: 18 }}>🏆</span>
                              <h3 style={{ fontSize: 17 }}>10-Mark University Answer Blueprint & Common Pitfalls</h3>
                            </div>
                            <div className="mb-3 text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
                              {enrichedUnit.examBlueprint.blueprint || enrichedUnit.examBlueprint}
                            </div>
                            {enrichedUnit.examBlueprint.pitfalls && (
                              <div style={{ background: 'var(--coral-wash)', color: 'var(--coral-deep)', padding: '10px 14px', borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
                                <strong>⚠️ Common Student Pitfalls & Marks Losers:</strong> {enrichedUnit.examBlueprint.pitfalls}
                              </div>
                            )}
                          </div>
                        )}

                        {/* PART 7: SOLVED PYQS FOR THIS SPECIFIC UNIT */}
                        {(unitSubView === 'all' || unitSubView === 'pyqs') && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 18 }}>📝</span>
                                <h3 style={{ fontSize: 17 }}>Solved University Previous Year Questions ({enrichedUnit.unit})</h3>
                              </div>
                              <button className="btn btn-ghost btn-sm" onClick={() => { setPyqForm({ ...pyqForm, unit: enrichedUnit.unit }); setContributeModal('pyq'); }}>
                                <LuPlus size={13} /> Add PYQ for {enrichedUnit.unit}
                              </button>
                            </div>
                            {unitPyqs.length === 0 ? (
                              <div style={{ background: 'var(--paper)', padding: '16px', borderRadius: 10, textAlign: 'center', border: '1px dashed var(--line)' }}>
                                <p className="text-xs muted">No specific PYQs tagged for {enrichedUnit.unit} yet. Check the main PYQ tab or contribute one above!</p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-3">
                                {unitPyqs.map(q => {
                                  const isOpen = !!expandedPyqIds[q.id];
                                  return (
                                    <div key={q.id} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 14 }}>
                                      <div className="flex justify-between items-center mb-2" style={{ flexWrap: 'wrap', gap: 6 }}>
                                        <div className="flex gap-2">
                                          <Pill tone="amber">{q.year}</Pill>
                                          <Pill tone="slate">{q.marks} Marks</Pill>
                                          {q.frequency && <Pill tone="coral">{q.frequency}</Pill>}
                                        </div>
                                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleAnswer(q.id)}>
                                          {isOpen ? <LuChevronUp size={13} /> : <LuChevronDown size={13} />}
                                          {isOpen ? 'Hide Answer' : 'View Model Answer'}
                                        </button>
                                      </div>
                                      <div className="font-semibold text-sm mb-2">{q.question}</div>
                                      {isOpen && (
                                        <div className="mt-2 text-sm fade-in" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 12, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                          {q.answer}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* PART 8: UNIT ASSIGNMENTS & SUBMISSIONS TRACKER */}
                        {(unitSubView === 'all' || unitSubView === 'assignments') && (
                          <div className="panel panel-pad fade-in">
                            <div className="flex justify-between items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 18 }}>📋</span>
                                <div>
                                  <h3 style={{ fontSize: 17 }}>Assignments & Practice Problems for {enrichedUnit.unit}</h3>
                                  <div className="text-xs muted">Track lab experiments, coding submissions, and unit assignments</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenUnitAssignmentModal(enrichedUnit.unit)}
                              >
                                <LuPlus size={13} /> Add Assignment for {enrichedUnit.unit}
                              </button>
                            </div>

                            {unitAssignments.length === 0 ? (
                              <div style={{ background: 'var(--paper)', border: '1px dashed var(--line)', borderRadius: 10, padding: '24px', textAlign: 'center' }}>
                                <p className="text-sm font-semibold mb-1">No assignments added for {enrichedUnit.unit} yet</p>
                                <p className="text-xs muted mb-3">Add lab exercises, homework tasks, or coding problems specific to this unit.</p>
                                <button
                                  type="button"
                                  className="btn btn-accent btn-sm"
                                  onClick={() => handleOpenUnitAssignmentModal(enrichedUnit.unit)}
                                >
                                  <LuPlus size={13} /> Create {enrichedUnit.unit} Assignment
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                {unitAssignments.map(a => (
                                  <div key={a.id} className="row-item" style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
                                    <input
                                      type="checkbox"
                                      checked={a.status === 'Completed'}
                                      onChange={() => updateAssignment(a.id, { status: a.status === 'Completed' ? 'Pending' : 'Completed' })}
                                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                      <div className={`text-sm font-semibold ${a.status === 'Completed' ? 'line-through muted' : ''}`}>{a.title}</div>
                                      <div className="text-xs muted mt-0.5">
                                        Due: {a.dueDate || 'No deadline'} • Priority: <span style={{ fontWeight: 600 }}>{a.priority}</span>
                                        {a.description && ` • ${a.description}`}
                                      </div>
                                    </div>
                                    <Pill tone={a.status === 'Completed' ? 'sage' : 'amber'}>{a.status}</Pill>
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-sm text-danger"
                                      title="Delete Assignment"
                                      onClick={() => deleteAssignment(a.id)}
                                    >
                                      <LuTrash2 size={13} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* BOTTOM UNIT PAGING NAVIGATION */}
                        <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={safeUnitIndex === 0}
                            onClick={() => { setSelectedUnitIndex(prev => Math.max(0, prev - 1)); setUnitSubView('all'); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                          >
                            ← Previous Unit ({safeUnitIndex > 0 ? activeUnits[safeUnitIndex - 1].unit : 'Start'})
                          </button>
                          <span className="text-xs font-semibold muted">
                            {enrichedUnit.unit} of {activeUnits.length} Units
                          </span>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={safeUnitIndex >= activeUnits.length - 1}
                            onClick={() => { setSelectedUnitIndex(prev => Math.min(activeUnits.length - 1, prev + 1)); setUnitSubView('all'); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                          >
                            Next Unit ({safeUnitIndex < activeUnits.length - 1 ? activeUnits[safeUnitIndex + 1].unit : 'End'}) →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB: PREVIOUS YEAR QUESTIONS (PYQs) */}
                    {activeTab === 'pyqs' && (
                      <div>
                        <div className="flex justify-between items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
                          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                            {availableYears.map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                className={`btn btn-sm ${yearFilter === yr ? 'btn-accent' : 'btn-ghost'}`}
                                onClick={() => setYearFilter(yr)}
                              >
                                {yr === 'All' ? 'All Years' : yr}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className={`btn btn-sm ${importantOnly ? 'btn-accent' : 'btn-ghost'}`}
                              onClick={() => setImportantOnly(!importantOnly)}
                            >
                              <LuSparkles size={13} /> Important & Repeated Only
                            </button>
                            {filteredPyqs.length > 0 && (
                              <button type="button" className="btn btn-sm btn-ghost" onClick={toggleExpandAll}>
                                {allExpanded ? <LuChevronUp size={13} /> : <LuChevronDown size={13} />}
                                {allExpanded ? 'Collapse All Answers' : 'Expand All Answers'}
                              </button>
                            )}
                            <button
                              type="button"
                              className={`btn btn-sm ${bookmarkedOnly ? 'btn-primary' : 'btn-ghost'}`}
                              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                            >
                              <LuBookmark size={13} /> Bookmarked ({progress.bookmarkedQuestionIds.length})
                            </button>
                          </div>
                        </div>

                        {availableMarks.length > 2 && (
                          <div className="flex gap-2 items-center mb-4" style={{ flexWrap: 'wrap' }}>
                            <span className="text-xs font-semibold muted">Filter by ETT Marks:</span>
                            {availableMarks.map((mk) => (
                              <button
                                key={mk}
                                type="button"
                                className={`btn btn-sm ${marksFilter === mk ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setMarksFilter(mk)}
                              >
                                {mk === 'All' ? `All Marks (${activePyqs.length})` : `${mk} Mark${mk === '1' ? '' : 's'} (${activePyqs.filter((q) => String(q.marks) === mk).length})`}
                              </button>
                            ))}
                          </div>
                        )}

                        {filteredPyqs.length === 0 ? (
                          <div className="panel">
                            <EmptyState
                              icon="📄"
                              title="No matching questions"
                              description="Adjust year/bookmark filter or add a previous year question with solution."
                              action={<button className="btn btn-primary btn-sm" onClick={() => setContributeModal('pyq')}><LuPlus size={13} /> Add PYQ & Answer</button>}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {filteredPyqs.map((q) => {
                              const isOpen = !!expandedPyqIds[q.id];
                              const isRevised = progress.revisedQuestionIds.includes(q.id);
                              const isSaved = progress.bookmarkedQuestionIds.includes(q.id);
                              return (
                                <div key={q.id} className="panel panel-pad fade-in">
                                  <div className="flex justify-between items-start mb-3" style={{ flexWrap: 'wrap', gap: 8 }}>
                                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                      <Pill tone="amber">{q.year}</Pill>
                                      <Pill tone="slate">{q.marks} Marks</Pill>
                                      <Pill tone="sage">{q.section} • {q.unit}</Pill>
                                      {q.frequency && <Pill tone="coral">{q.frequency}</Pill>}
                                    </div>
                                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        className={`btn btn-sm ${isRevised ? 'btn-accent' : 'btn-ghost'}`}
                                        onClick={() => toggleProgressItem('revisedQuestionIds', q.id)}
                                      >
                                        <LuCheck size={13} /> {isRevised ? 'Revised' : 'Mark Revised'}
                                      </button>
                                      <button
                                        type="button"
                                        className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => toggleProgressItem('bookmarkedQuestionIds', q.id)}
                                      >
                                        <LuBookmark size={13} /> {isSaved ? 'Saved' : 'Save'}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCreateTaskFromPyq(q.question)}
                                      >
                                        <LuPlus size={13} /> Add Task
                                      </button>
                                    </div>
                                  </div>

                                  <div className="font-semibold mb-3" style={{ fontSize: 15.5, lineHeight: 1.5 }}>{q.question}</div>

                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => toggleAnswer(q.id)}
                                  >
                                    {isOpen ? <LuChevronUp size={14} /> : <LuChevronDown size={14} />}
                                    {isOpen ? 'Hide Full Answer' : 'View Full Answer & Exam Tip'}
                                  </button>

                                  {isOpen && (
                                    <div className="mt-4 fade-in" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
                                      <div className="text-xs font-bold muted mb-2" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Model Exam Solution</div>
                                      <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{q.answer}</div>
                                      {q.examTip && (
                                        <div className="mt-3 text-xs" style={{ background: 'var(--amber-wash)', color: 'var(--amber-deep)', padding: '10px 12px', borderRadius: 8 }}>
                                          <strong>Exam Scoring Tip:</strong> {q.examTip}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: UNIT ASSIGNMENTS TRACKER ACROSS ALL UNITS */}
                    {activeTab === 'assignments' && (
                      <div>
                        <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <h3 style={{ fontSize: 18 }}>Unit Assignments & Homework Hub</h3>
                            <p className="text-xs muted">Filter, track, and complete assignments across Unit 1 to Unit 6</p>
                          </div>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenUnitAssignmentModal(`Unit ${safeUnitIndex + 1}`)}
                          >
                            <LuPlus size={13} /> Add New Assignment
                          </button>
                        </div>

                        {/* Unit Filter Buttons */}
                        <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                          {['All Units', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'].map((u) => (
                            <button
                              key={u}
                              type="button"
                              className={`btn btn-sm ${assignmentUnitFilter === u ? 'btn-primary' : 'btn-ghost'}`}
                              onClick={() => setAssignmentUnitFilter(u)}
                            >
                              {u} ({u === 'All Units' ? assignments.length : assignments.filter((a) => (a.unit || 'Unit 1') === u).length})
                            </button>
                          ))}
                        </div>

                        {crossUnitAssignments.length === 0 ? (
                          <div className="panel">
                            <EmptyState
                              icon="📋"
                              title="No assignments found for this filter"
                              description="Create a new assignment for this unit using the button below."
                              action={
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleOpenUnitAssignmentModal(assignmentUnitFilter !== 'All Units' ? assignmentUnitFilter : 'Unit 1')}
                                >
                                  <LuPlus size={13} /> Add Assignment
                                </button>
                              }
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {crossUnitAssignments.map((a) => (
                              <div key={a.id} className="panel panel-pad fade-in flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
                                <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 240 }}>
                                  <input
                                    type="checkbox"
                                    checked={a.status === 'Completed'}
                                    onChange={() => updateAssignment(a.id, { status: a.status === 'Completed' ? 'Pending' : 'Completed' })}
                                    style={{ width: 17, height: 17, cursor: 'pointer' }}
                                  />
                                  <div>
                                    <div className={`font-semibold text-sm ${a.status === 'Completed' ? 'line-through muted' : ''}`}>{a.title}</div>
                                    <div className="text-xs muted mt-1 flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
                                      <Pill tone="amber">{a.unit || 'Unit 1'}</Pill>
                                      <span>Due: {a.dueDate || 'No deadline'}</span>
                                      <span>•</span>
                                      <span>Priority: <strong style={{ color: 'var(--ink)' }}>{a.priority}</strong></span>
                                      {a.description && <span>• {a.description}</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <Pill tone={a.status === 'Completed' ? 'sage' : 'coral'}>{a.status}</Pill>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm text-danger"
                                    onClick={() => deleteAssignment(a.id)}
                                  >
                                    <LuTrash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* TAB 4: ETT & UNIVERSITY EXAM PATTERN */}
              {activeTab === 'pattern' && (
                <div className="grid grid-2" style={{ alignItems: 'start' }}>
                  <div className="panel panel-pad">
                    <h3 className="mb-4" style={{ fontSize: 18 }}>Question Paper Blueprint</h3>
                    <div className="grid grid-3 mb-4">
                      <div className="panel panel-pad" style={{ background: 'var(--amber-wash)', border: 'none' }}>
                        <div className="text-xs muted">Total Marks</div>
                        <div className="font-bold" style={{ fontSize: 22 }}>{activePack.examPattern?.totalMarks || 70}</div>
                      </div>
                      <div className="panel panel-pad" style={{ background: 'var(--slate-wash)', border: 'none' }}>
                        <div className="text-xs muted">Duration</div>
                        <div className="font-bold" style={{ fontSize: 18 }}>{activePack.examPattern?.duration || '3 Hours'}</div>
                      </div>
                      <div className="panel panel-pad" style={{ background: 'var(--sage-wash)', border: 'none' }}>
                        <div className="text-xs muted">Passing</div>
                        <div className="font-semibold text-sm">{activePack.examPattern?.passingMarks || '40%'}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(activePack.examPattern?.sections || []).map((sec, idx) => (
                        <div key={idx} className="tab-mark" style={{ padding: '10px 14px', background: 'var(--paper)', borderRadius: 10, border: '1px solid var(--line)' }}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm">{sec.name}</span>
                            <Pill tone="amber">{sec.questionCount} • {sec.marksPerQuestion}</Pill>
                          </div>
                          <div className="text-xs soft">{sec.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel panel-pad">
                    <h3 className="mb-2" style={{ fontSize: 18 }}>High-Weightage Repeated Topics</h3>
                    <p className="text-xs muted mb-4">Focus on these recurring university topics first for maximum ETT/Final marks.</p>
                    <div className="flex flex-col gap-2">
                      {(activePack.examPattern?.highWeightageTopics || []).map((topic, idx) => (
                        <div key={idx} className="row-item" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 10 }}>
                          <span className="mono text-xs font-bold" style={{ color: 'var(--amber-deep)' }}>#{idx + 1}</span>
                          <span className="text-sm font-semibold" style={{ flex: 1 }}>{topic}</span>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleCreateTaskFromPyq(`${activePack.subject}: ${topic}`)}>
                            <LuPlus size={12} /> Schedule
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal: Create Custom University & Course Pack */}
      <Modal
        open={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        title="Add University / Course Exam Pack"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setPackModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreatePack}>Create Pack</button>
        </>}
      >
        <div className="field">
          <label className="field-label">University / College Name</label>
          <input className="field-input" value={packForm.university} onChange={(e) => setPackForm({ ...packForm, university: e.target.value })} placeholder="e.g. Lucknow University / ABC College" />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Course</label>
            <input className="field-input" value={packForm.course} onChange={(e) => setPackForm({ ...packForm, course: e.target.value })} placeholder="e.g. BCA, B.Tech CSE, ETT" />
          </div>
          <div className="field">
            <label className="field-label">Semester / Year</label>
            <input className="field-input" value={packForm.semester} onChange={(e) => setPackForm({ ...packForm, semester: e.target.value })} placeholder="e.g. Sem 4" />
          </div>
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Subject Name</label>
            <input className="field-input" value={packForm.subject} onChange={(e) => setPackForm({ ...packForm, subject: e.target.value })} placeholder="e.g. Discrete Mathematics" />
          </div>
          <div className="field">
            <label className="field-label">Exam Type</label>
            <select className="field-input" value={packForm.examType} onChange={(e) => setPackForm({ ...packForm, examType: e.target.value })}>
              {EXAM_TYPES.filter((t) => t !== 'All Exam Types').map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal: Contribute PYQ or Unit Note */}
      <Modal
        open={!!contributeModal}
        onClose={() => setContributeModal(null)}
        title={contributeModal === 'pyq' ? `Add PYQ & Answer (${activePack?.subject})` : `Add Unit Note (${activePack?.subject})`}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setContributeModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleContributeSubmit}>Save to Database</button>
        </>}
      >
        {contributeModal === 'pyq' ? (
          <>
            <div className="grid grid-3">
              <div className="field">
                <label className="field-label">Year</label>
                <input type="number" className="field-input" value={pyqForm.year} onChange={(e) => setPyqForm({ ...pyqForm, year: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label className="field-label">Marks</label>
                <input type="number" className="field-input" value={pyqForm.marks} onChange={(e) => setPyqForm({ ...pyqForm, marks: Number(e.target.value) })} />
              </div>
              <div className="field">
                <label className="field-label">Unit</label>
                <input className="field-input" value={pyqForm.unit} onChange={(e) => setPyqForm({ ...pyqForm, unit: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Previous Year Question</label>
              <textarea className="field-input" rows={3} value={pyqForm.question} onChange={(e) => setPyqForm({ ...pyqForm, question: e.target.value })} placeholder="Enter exact university question..." />
            </div>
            <div className="field">
              <label className="field-label">Model Answer / Solution</label>
              <textarea className="field-input" rows={5} value={pyqForm.answer} onChange={(e) => setPyqForm({ ...pyqForm, answer: e.target.value })} placeholder="Write clear step-by-step exam solution..." />
            </div>
            <div className="field">
              <label className="field-label">Exam Scoring Tip (Optional)</label>
              <input className="field-input" value={pyqForm.examTip} onChange={(e) => setPyqForm({ ...pyqForm, examTip: e.target.value })} placeholder="e.g. Draw diagram for full marks" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-2">
              <div className="field">
                <label className="field-label">Unit</label>
                <input className="field-input" value={noteForm.unit} onChange={(e) => setNoteForm({ ...noteForm, unit: e.target.value })} />
              </div>
              <div className="field">
                <label className="field-label">Topic Title</label>
                <input className="field-input" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="e.g. Deadlock & Semaphores" />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Full Study Notes</label>
              <textarea className="field-input" rows={5} value={noteForm.summary} onChange={(e) => setNoteForm({ ...noteForm, summary: e.target.value })} placeholder="Write comprehensive concepts & formulas..." />
            </div>
            <div className="field">
              <label className="field-label">Key Bullet Points (One per line)</label>
              <textarea className="field-input" rows={3} value={noteForm.keyPoints} onChange={(e) => setNoteForm({ ...noteForm, keyPoints: e.target.value })} placeholder="Key formula 1&#10;Key distinction 2" />
            </div>
          </>
        )}
      </Modal>

      {/* Modal: Add Unit Assignment */}
      <Modal
        open={unitAssignmentModalOpen}
        onClose={() => setUnitAssignmentModalOpen(false)}
        title={`Add Assignment for ${unitAssignmentForm.unit} (${activePack?.subject || 'Subject'})`}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setUnitAssignmentModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveUnitAssignment}>Save Assignment</button>
        </>}
      >
        <div className="field">
          <label className="field-label">Assignment Title</label>
          <input
            className="field-input"
            value={unitAssignmentForm.title}
            onChange={(e) => setUnitAssignmentForm({ ...unitAssignmentForm, title: e.target.value })}
            placeholder="e.g. Implement AVL Balance Rotations in C++"
            autoFocus
          />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Target Unit</label>
            <select
              className="field-input"
              value={unitAssignmentForm.unit}
              onChange={(e) => setUnitAssignmentForm({ ...unitAssignmentForm, unit: e.target.value })}
            >
              {['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Due Date</label>
            <input
              type="date"
              className="field-input"
              value={unitAssignmentForm.dueDate}
              onChange={(e) => setUnitAssignmentForm({ ...unitAssignmentForm, dueDate: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label className="field-label">Priority</label>
            <select
              className="field-input"
              value={unitAssignmentForm.priority}
              onChange={(e) => setUnitAssignmentForm({ ...unitAssignmentForm, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label">Linked Subject</label>
            <input
              className="field-input"
              value={activePack?.subject || 'Current Subject'}
              disabled
              style={{ opacity: 0.8 }}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Instructions / Problem Description (Optional)</label>
          <textarea
            className="field-input"
            rows={3}
            value={unitAssignmentForm.description}
            onChange={(e) => setUnitAssignmentForm({ ...unitAssignmentForm, description: e.target.value })}
            placeholder="e.g. Upload .c source code and output screenshot on portal."
          />
        </div>
      </Modal>
    </div>
  );
}
