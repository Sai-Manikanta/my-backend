const SandboxPageData = require('../models/sandboxPageData');

const createSandboxPageData = async (req, res) => {
    try {
        const newSandboxPageData = new SandboxPageData(req.body);

        const savedSandboxPageData = await newSandboxPageData.save();

        res.status(201).json({
            message: 'Created SandboxPageData successfully',
            data: {
                savedSandboxPageData
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getSandboxPageData = async (req, res) => {
    try {
        const queryApi = req?.params?.queryApi;

        console.log(queryApi)
        
        if (!queryApi) {
            return res.status(400).json({ message: 'queryApi parameter is required' });
        }

        const sandboxPageData = await SandboxPageData.findOne({ name: queryApi });

        if (!sandboxPageData) {
            return res.status(404).json({ message: 'Sandbox Page Data not found' });
        }

        return res.status(200).json({
            message: 'Sandbox Page Data fetched successfully',
            data: sandboxPageData
        });
    } catch (err) {
        console.error(err);  
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateSandboxData = async (req, res) => {
    const { name } = req.params;
    const { responseParameters } = req.body;
  
    if (!responseParameters) {
      return res.status(400).send({ message: 'responseParameters is required' });
    }
  
    try {
      const updatedDocument = await SandboxPageData.findOneAndUpdate(
        { name },
        { $set: { 'response.responseParameters': responseParameters } },
        { new: true }
      );
  
      if (!updatedDocument) {
        return res.status(404).send({ message: 'Document not found' });
      }
  
      res.status(200).send(updatedDocument);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


module.exports = {
    createSandboxPageData,
    getSandboxPageData,
    updateSandboxData
}