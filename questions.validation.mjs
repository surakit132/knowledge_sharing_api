export const validCreateAndUpdateQuestion = (req, res, next) => {
    if (!req.body.title) {
        return res.status(401).json({ message: "Please enter a title!"})
    }
    if (!req.body.description) {
        return res.status(401).json({ message: "Please enter a description!"})
    }
    if (!req.body.category) {
        return res.status(401).json({ message: "Please enter a category!"})
    }
    next()
}