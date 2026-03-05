import json
import uuid

def generate_roadmap(skills, target_role):
    """
    Generates a structured weekly roadmap based on the target role and user's skills.
    """
    target_role_lower = target_role.lower() if target_role else "software developer"
    
    # Define week blocks consistent with UI
    weeks = [
        "Week 1-2", "Week 3-4", "Week 5-8", "Week 9-12", 
        "Week 13-16", "Week 17-20", "Week 21-24", "Week 25+"
    ]
    
    roadmap = []
    
    # Specialist Roadmaps
    if "blockchain" in target_role_lower:
        tasks = {
            "Week 1-2": [
                {"id": str(uuid.uuid4()), "task": "Blockchain Fundamentals", "details": "Study distributed ledger technology and consensus (PoW, PoS)."},
                {"id": str(uuid.uuid4()), "task": "Cryptography Basics", "details": "Learn about hashing, public/private keys, and digital signatures."}
            ],
            "Week 3-4": [
                {"id": str(uuid.uuid4()), "task": "Smart Contract Basics", "details": "Introduction to Solidity syntax and structure."},
                {"id": str(uuid.uuid4()), "task": "EVM Fundamentals", "details": "Understanding the Ethereum Virtual Machine and gas mechanics."}
            ],
            "Week 5-8": [
                {"id": str(uuid.uuid4()), "task": "Advanced Smart Contracts", "details": "Learn about inheritance, interfaces, and library usage in Solidity."},
                {"id": str(uuid.uuid4()), "task": "Security Patterns", "details": "Study reentrancy, overflow, and other common vulnerabilities."}
            ],
            "Week 9-12": [
                {"id": str(uuid.uuid4()), "task": "dApp Development", "details": "Connect smart contracts to a frontend using Ethers.js or Web3.js."},
                {"id": str(uuid.uuid4()), "task": "DeFi Protocols", "details": "Analyze Uniswap, Aave, and stablecoin architectures."}
            ],
            "Week 13-16": [
                {"id": str(uuid.uuid4()), "task": "Layer 2 Solutions", "details": "Explore Optimism, Arbitrum, and ZK-rollups."},
                {"id": str(uuid.uuid4()), "task": "Project Initiation", "details": "Start building an NFT marketplace or a custom token."}
            ],
            "Week 17-20": [
                {"id": str(uuid.uuid4()), "task": "Testing & Deployment", "details": "Use Hardhat or Foundry for unit testing and testnet deployment."},
                {"id": str(uuid.uuid4()), "task": "Portfolio Building", "details": "Document your projects on GitHub and write technical articles."}
            ],
            "Week 21-24": [
                {"id": str(uuid.uuid4()), "task": "Interview Preparation", "details": "Practice blockchain system design and common Solidity interview questions."},
                {"id": str(uuid.uuid4()), "task": "Mock Audits", "details": "Review open-source contracts for security issues."}
            ],
            "Week 25+": [
                {"id": str(uuid.uuid4()), "task": "Job Application", "details": "Apply to Web3 startups and contribute to DAOs."},
                {"id": str(uuid.uuid4()), "task": "Final Certification", "details": "Complete your final project and request certification."}
            ]
        }
    elif "software" in target_role_lower or "developer" in target_role_lower:
        tasks = {
            "Week 1-2": [
                {"id": str(uuid.uuid4()), "task": "Git Fundamentals", "details": "Master branching, merging, and pull request workflows."},
                {"id": str(uuid.uuid4()), "task": "Data Structures", "details": "Review Arrays, Linked Lists, Stacks, and Queues."}
            ],
            "Week 3-4": [
                {"id": str(uuid.uuid4()), "task": "Backend Fundamentals", "details": "Learn RESTful API principles and HTTP methods."},
                {"id": str(uuid.uuid4()), "task": "Database Design", "details": "Study SQL basics, normalization, and relational modeling."}
            ],
            "Week 5-8": [
                {"id": str(uuid.uuid4()), "task": "Build Mini Project", "details": "Create a full CRUD application with a database."},
                {"id": str(uuid.uuid4()), "task": "Unit Testing", "details": "Implement tests for your core business logic."}
            ],
            "Week 9-12": [
                {"id": str(uuid.uuid4()), "task": "Frontend Enhancement", "details": "Integrate React or your chosen framework with your backend."},
                {"id": str(uuid.uuid4()), "task": "State Management", "details": "Learn Redux, Context API, or similar patterns."}
            ],
            "Week 13-16": [
                {"id": str(uuid.uuid4()), "task": "System Architecture", "details": "Study caching, load balancing, and message queues."},
                {"id": str(uuid.uuid4()), "task": "Cloud Deployment", "details": "Deploy your application to AWS, Azure, or GCP."}
            ],
            "Week 17-20": [
                {"id": str(uuid.uuid4()), "task": "Code Optimization", "details": "Refactor code for performance and readability."},
                {"id": str(uuid.uuid4()), "task": "Open Source Contribution", "details": "Contribute to a project related to your stack."}
            ],
            "Week 21-24": [
                {"id": str(uuid.uuid4()), "task": "Interview Cracking", "details": "Focus on LeetCode challenges and architectural design."},
                {"id": str(uuid.uuid4()), "task": "Soft Skills", "details": "Practice behavioral questions and communication."}
            ],
            "Week 25+": [
                {"id": str(uuid.uuid4()), "task": "Career Launch", "details": "Apply for roles and reach out to recruiters."},
                {"id": str(uuid.uuid4()), "task": "Certification", "details": "Finalize your transition and get certified."}
            ]
        }
    else:
        # Default detailed roadmap
        tasks = {w: [
            {"id": str(uuid.uuid4()), "task": f"Phase {i+1} Core Learning", "details": f"Master fundamental concepts for {target_role}."},
            {"id": str(uuid.uuid4()), "task": f"Phase {i+1} Practical Application", "details": f"Build a project demonstrating {target_role} skills."}
        ] for i, w in enumerate(weeks)}

    # Build the final roadmap array
    for week in weeks:
        roadmap.append({
            "time": week,
            "tasks": tasks.get(week, [])
        })
        
    return roadmap

def generate_week_exam(week_label, target_role):
    """
    Generates a set of 5 multiple-choice questions for a specific week and role.
    """
    target_role_lower = target_role.lower() if target_role else "software developer"
    
    exams = {
        "blockchain": {
            "Week 1-2": [
                {"q": "What is the primary function of a hash function in blockchain?", "options": ["Data compression", "Ensuring data integrity", "Increasing block size", "Speeding up transactions"], "correct": 1},
                {"q": "Which consensus mechanism relies on 'stake' rather than computational power?", "options": ["Proof of Work", "Proof of History", "Proof of Stake", "Proof of Authority"], "correct": 2},
                {"q": "A genesis block is:", "options": ["The most recent block", "A block with no transactions", "The very first block in a chain", "A block awaiting validation"], "correct": 2},
                {"q": "Public keys are used to:", "options": ["Sign transactions", "Identify an account address", "Encrypt the private key", "Mine new blocks"], "correct": 1},
                {"q": "What does decentralization mean in blockchain?", "options": ["One central authority owns the data", "No single entity controls the network", "All users must be anonymous", "Data is stored on a single server"], "correct": 1}
            ],
            "Week 3-4": [
                {"q": "Which of these is the most popular language for Ethereum smart contracts?", "options": ["Rust", "Python", "Solidity", "Go"], "correct": 2},
                {"q": "What is 'Gas' in the context of EVM?", "options": ["The physical fuel for miners", "The unit measuring computational effort", "A cryptocurrency token", "The speed of the network"], "correct": 1},
                {"q": "An immutable smart contract means:", "options": ["It can be updated anytime", "The code cannot be changed after deployment", "It only runs once", "It is private to the owner"], "correct": 1},
                {"q": "A Reentrancy attack occurs when:", "options": ["The network goes down", "An external contract calls back before state updates", "A user loses their private key", "A block is double-mined"], "correct": 1},
                {"q": "The EVM is a:", "options": ["Physical computer", "Virtual runtime environment", "Database type", "Mobile app for wallets"], "correct": 1}
            ]
        },
        "software": {
            "Week 1-2": [
                {"q": "Which command is used to move changes from your local branch to a remote repository?", "options": ["git pull", "git commit", "git push", "git init"], "correct": 2},
                {"q": "What is the time complexity of searching in a sorted array using Binary Search?", "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"], "correct": 1},
                {"q": "A Linked List is better than an Array for:", "options": ["Random access", "Memory efficiency", "Frequent insertions/deletions", "Searching for elements"], "correct": 2},
                {"q": "What does a 'Merge Conflict' occur?", "options": ["When you pull from remote", "When two people edit the same line of code", "When a file is deleted", "When you commit code"], "correct": 1},
                {"q": "The 'HEAD' in Git points to:", "options": ["The first commit", "The current active branch/commit", "The remote server", "The stash"], "correct": 1}
            ],
            "Week 3-4": [
                {"q": "What does REST stand for?", "options": ["Representational State Transfer", "Remote System Terminal", "Refined State Toogle", "Rapid Entry Service Task"], "correct": 0},
                {"q": "Which HTTP method is typically used to create a new resource?", "options": ["GET", "PUT", "POST", "DELETE"], "correct": 2},
                {"q": "A Primary Key in a database must be:", "options": ["A string", "Unique and not null", "Encrypted", "An integer"], "correct": 1},
                {"q": "What is the purpose of Database Normalization?", "options": ["To increase data redundancy", "To reduce data redundancy and improve integrity", "To speed up GET requests only", "To encrypt data"], "correct": 1},
                {"q": "What does a 404 status code mean?", "options": ["Internal Server Error", "Unauthorized", "Not Found", "Success"], "correct": 2}
            ]
        }
    }
    
    # Select the right exam category
    active_exam = exams["software"] # Default
    if "blockchain" in target_role_lower:
        active_exam = exams["blockchain"]
    
    # Return questions for the week or empty if not defined
    return active_exam.get(week_label, [
        {"q": f"Question 1 for {week_label} in {target_role}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0},
        {"q": f"Question 2 for {week_label} in {target_role}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 1},
        {"q": f"Question 3 for {week_label} in {target_role}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 2},
        {"q": f"Question 4 for {week_label} in {target_role}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 3},
        {"q": f"Question 5 for {week_label} in {target_role}?", "options": ["Option A", "Option B", "Option C", "Option D"], "correct": 0}
    ])
