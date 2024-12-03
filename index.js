//boilerplate code for node server
const envVars = require('dotenv').config();
const express = require('express');
const multer = require("multer")
const fs = require('fs');
const { getAssistantResponse, generateCaption } = require('./services/captionGeneratorService');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
// headers and content type
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'resources/');   
   // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file,   
   cb) {
      // Generate a unique filename to avoid conflicts
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // remove all files in this directory before saving new file
        fs.readdir('resources/', (err, files) => {
            if (err) throw err;
        
            for (const file of files) {
            fs.unlink(`resources/${file}`, err => {
                if (err) throw err;
            });
            }
        });
      cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg"); // You can adjust the extension as needed
    },
  });
  
  const upload = multer({ storage: storage });


let lastGenerated = [];
app.post('/generate-caption', upload.single('image'), // Use multer middleware to handle image upload
    async (req, res) => {
      try {
        console.log('Generating caption...');
        if(req.body.regenerate.toLowerCase() === 'true') {
          if(lastGenerated.length > 0) {
            const { 
                caption: lastGeneratedCaption, 
                imageDescription: lastGeneratedDesciption, 
                theme: lastGeneratedTheme, 
                context: lastGenerateContext 
            } = lastGenerated.pop();
            const caption = await getAssistantResponse(lastGeneratedDesciption, 
                lastGeneratedTheme, 
                lastGenerateContext, 
                lastGeneratedCaption);
            lastGenerated.push({ caption, imageDescription: lastGeneratedDesciption });
            res.status(200).send(caption);
            console.log('Caption generated:', caption);
            return;
          }
        }

        const filePath = req.file.path; // Get the path of the uploaded image
        const { theme, context } = req.body;
        const { caption, imageDescription } = await generateCaption(filePath, theme, context);
        lastGenerated.push({ caption, imageDescription, theme, context, filePath });
        res.status(200).send(caption);
        console.log('Caption generated:', caption);
      } catch (error) {
        console.error("Error generating caption:", error);
        res.status(500).json({ error: "Failed to generate caption" });
      }
    }
  );
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
