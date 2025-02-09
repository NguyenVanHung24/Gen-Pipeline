exports.getUsers = async (req, res) => {
    try {
        // Fake data for testing
        const fakeUsers = 
            {
                id: '1',
                username: 'testuser1',
                email: 'testuser1@example.com',
                role: 'admin'
            }
        // Simulate a delay to mimic database query time
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.status(200).json({
            users: fakeUsers
        });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({
            error: 'Error getting users',
            message: error.message
        });
    }
};
