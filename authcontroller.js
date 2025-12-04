const User = require('../models/User'); // User मॉडल को import करें (User.js जो आपने models फोल्डर में बनाया है)
const bcrypt = require('bcryptjs');     // पासवर्ड हैश करने के लिए

// Registration Logic
const registerUser = async (req, res) => {
    // 1. Request Body से details निकालें (destructuring)
    // ये वो डेटा है जो Postman से आएगा: name, email, password
    const { name, email, password } = req.body;

    // 2. Validation (जाँच करें कि कोई फ़ील्ड खाली तो नहीं है)
    if (!name || !email || !password) {
        // अगर कोई फ़ील्ड मिसिंग है तो 400 Bad Request एरर भेजें
        return res.status(400).json({ msg: 'कृपया सभी फ़ील्ड्स भरें (नाम, ईमेल, पासवर्ड)' });
    }

    try {
        // 3. जाँच करें कि यूज़र पहले से मौजूद है या नहीं (ईमेल unique होना चाहिए)
        let user = await User.findOne({ email });

        if (user) {
            // अगर ईमेल पहले से इस्तेमाल हो रहा है
            return res.status(400).json({ msg: 'यह ईमेल पहले से पंजीकृत (registered) है।' });
        }

        // 4. नया User ऑब्जेक्ट बनाएँ (Mongoose Document)
        user = new User({
            name,
            email,
            password, 
        });

        // 5. Password को Hash करें (Encrypt)
        // salt: यह एक रैंडम स्ट्रिंग है जो हैशिंग को और सुरक्षित बनाती है।
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(password, salt); // पासवर्ड अब सुरक्षित (hashed) हो गया है

        // 6. User को Database में सेव करें
        await user.save();

        // 7. सफलता का मैसेज भेजें
        // Status 201 मतलब नया रिसोर्स (User) सफलतापूर्वक बना दिया गया है
        res.status(201).json({ 
            msg: 'यूज़र सफलतापूर्वक पंजीकृत हुआ।', 
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        // अगर कोई अनपेक्षित एरर आए
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// इस फंक्शन को export करें
module.exports = {
    registerUser
};

console.log('Received body:', req.body);