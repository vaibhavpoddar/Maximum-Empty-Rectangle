class Node{
	constructor(key){
		this.key    = key;
		this.left   = null;
		this.right  = null;
		this.height = 1;
	}
}

function insertNode(node, key) 
{ 
	/* 1. Perform the normal BST insertion */
	if (node == null) 
		return newNode(key); 

	if (key < node.key) 
		node.left = insertNode(node.left, key); 
	else if (key > node.key) 
		node.right = insertNode(node.right, key); 
	else // Equal keys are not allowed in BST 
		return node; 

	/* 2. Update height of this ancestor node */
	node.height = 1 + max(height(node.left), height(node.right)); 

	/* 3. Get the balance factor of this ancestor 
		node to check whether this node became 
		unbalanced */
	var balance = getBalance(node); 

	// If this node becomes unbalanced, then 
	// there are 4 cases 

	// Left Left Case 
	if (balance > 1 && key < node.left.key) 
		return rightRotate(node); 

	// Right Right Case 
	if (balance < -1 && key > node.right.key) 
		return leftRotate(node); 

	// Left Right Case 
	if (balance > 1 && key > node.left.key) 
	{ 
		node.left = leftRotate(node.left); 
		return rightRotate(node); 
	} 

	// Right Left Case 
	if (balance < -1 && key < node.right.key) 
	{ 
		node.right = rightRotate(node.right); 
		return leftRotate(node); 
	} 

	/* return the (unchanged) node pointer */
	return node; 
} 

// Recursive function to delete a node 
// with given key from subtree with 
// given root. It returns root of the 
// modified subtree. 
function deleteNode(root, key) 
{ 
	// STEP 1: PERFORM STANDARD BST DELETE 
	if (root == null) 
		return root; 

	// If the key to be deleted is smaller than the root's key, then it lies in left subtree 
	if ( key < root.key ) 
		root.left = deleteNode(root.left, key); 

	// If the key to be deleted is greater than the root's key, then it lies in right subtree 
	else if( key > root.key ) 
		root.right = deleteNode(root.right, key); 

	// if key is same as root's key, then this is the node to be deleted 
	else
	{ 
		// node with only one child or no child 
		if( (root.left == null) || (root.right == null) ) 
		{ 
			var temp = root.left ? root.left : root.right; 

			// No child case 
			if (temp == null) 
			{ 
				temp = root; 
				root = null; 
			} 
			else // One child case 
			{
				// Copy the contents of the non-empty child  
				root.key = temp.key;
				root.left = temp.left;
				root.right = temp.right;
			}
			// free(temp); 
		} 
		else
		{ 
			// node with two children: Get the inorder successor (smallest in the right subtree) 
			var temp = minValueNode(root.right); 

			// Copy the inorder successor's data to this node 
			root.key = temp.key; 

			// Delete the inorder successor 
			root.right = deleteNode(root.right, temp.key); 
		}
	}

	// If the tree had only one node then return 
	if (root == null) 
		return root; 

	// STEP 2: UPDATE HEIGHT OF THE CURRENT NODE 
	root.height = 1 + max(height(root.left), height(root.right)); 

	// STEP 3: GET THE BALANCE FACTOR OF THIS NODE (to check whether this node became unbalanced) 
	var balance = getBalance(root); 

	// If this node becomes unbalanced, then there are 4 cases 

	// Left Left Case 
	if (balance > 1 && getBalance(root.left) >= 0) 
		return rightRotate(root); 

	// Left Right Case 
	if (balance > 1 && getBalance(root.left) < 0) 
	{ 
		root.left = leftRotate(root.left); 
		return rightRotate(root); 
	} 

	// Right Right Case 
	if (balance < -1 && getBalance(root.right) <= 0) 
		return leftRotate(root); 

	// Right Left Case 
	if (balance < -1 && getBalance(root.right) > 0) 
	{ 
		root.right = rightRotate(root.right); 
		return leftRotate(root); 
	} 

	return root; 
} 

function max(a, b){
	if(a>=b) return a;
	return b;
}

function height(node){
	if(node==null) return 0;
	return node.height;
}

function newNode(key){ 
	var node = new Node(key); 
	return node; 
} 

function rightRotate(y){
	var x  = y.left;
	var T2 = x.right;
	x.right = y;
	y.left  = T2;
	y.height = max(height(y.left), height(y.right)) + 1;
	x.height = max(height(x.left), height(x.right)) + 1;
	return x;
}

function leftRotate(x){
	var y  = x.right; 
	var T2 = y.left; 
	y.left  = x; 
	x.right = T2; 
	x.height = max(height(x.left), height(x.right)) + 1; 
	y.height = max(height(y.left), height(y.right)) + 1; 
	return y;
}

function getBalance(node){
	if(node == null)
		return 0;
	return height(node.left) - height(node.right);
}

function minValueNode(node) 
{ 
	var current = node; 
	/* loop down to find the leftmost leaf */
	while (current.left != null) 
		current = current.left;
	return current; 
} 

function preOrder(root) 
{ 
	if(root != null) 
	{ 
		console.log(root.key);
		preOrder(root.left); 
		preOrder(root.right); 
	}
}

function MAIN(){
	var root = null;
	root = insertNode(root, 9); 
	root = insertNode(root, 5); 
	root = insertNode(root, 10); 
	root = insertNode(root, 0); 
	root = insertNode(root, 6); 
	root = insertNode(root, 11); 
	root = insertNode(root, -1); 
	root = insertNode(root, 1); 
	root = insertNode(root, 2); 

	// root = insert(root, 10);
	// root = insert(root, 10); 
	// root = insert(root, 20); 
	// root = insert(root, 30); 
	// root = insert(root, 40); 
	// root = insert(root, 50); 
	// root = insert(root, 25);
	console.log("Preorder traversal of the constructed AVL tree is:"); 
	preOrder(root);

	root = deleteNode(root, 10);

	console.log("Preorder traversal after deletion of 10"); 
	preOrder(root);

	console.log("done", root);
}

MAIN();