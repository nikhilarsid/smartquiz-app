import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


const loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        
        if (user && (await user.matchPassword(password))) {
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id), // Generate JWT
            });
        } else {
            
            res.status(401); // 401 Unauthorized
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};



const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};


export { registerUser, loginUser };