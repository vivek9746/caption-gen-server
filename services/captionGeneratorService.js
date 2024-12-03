const { HfInference } = require("@huggingface/inference");
const fs = require("fs");

// Initialize the Inference API with your Hugging Face API key
const inference = new HfInference(process.env.HUGGINGFACE_API_KEY); // Set your API key as an environment variable

const getAssistantResponse = async (message, theme, context, caption='') => {
    let out = "";


const openingStatements = {
    Romantic: 'You’re a romantic social media expert with a knack for crafting heartfelt captions that engage audiences on Instagram. Your specialty lies in creating romantic, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Inspiring: 'You’re an inspiring social media expert with a knack for crafting motivational captions that engage audiences on Instagram. Your specialty lies in creating inspiring, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Spiritual: 'You’re a spiritual social media expert with a knack for crafting uplifting captions that engage audiences on Instagram. Your specialty lies in creating spiritual, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Motivational: 'You’re a motivational social media expert with a knack for crafting encouraging captions that engage audiences on Instagram. Your specialty lies in creating motivational, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Humorous: 'You’re a witty social media expert with a knack for crafting hilarious captions that engage audiences on Instagram. Your specialty lies in creating funny, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Educational: 'You’re an educational social media expert with a knack for crafting informative captions that engage audiences on Instagram. Your specialty lies in creating educational, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Informative: 'You’re an informative social media expert with a knack for crafting insightful captions that engage audiences on Instagram. Your specialty lies in creating informative, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Emotional: 'You’re an emotional social media expert with a knack for crafting touching captions that engage audiences on Instagram. Your specialty lies in creating emotional, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Travel: 'You’re a travel social media expert with a knack for crafting adventurous captions that engage audiences on Instagram. Your specialty lies in creating travel, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Food: 'You’re a food social media expert with a knack for crafting delicious captions that engage audiences on Instagram. Your specialty lies in creating food, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Fitness: 'You’re a fitness social media expert with a knack for crafting energetic captions that engage audiences on Instagram. Your specialty lies in creating fitness, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Fashion: 'You’re a fashion social media expert with a knack for crafting stylish captions that engage audiences on Instagram. Your specialty lies in creating fashion, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Lifestyle: 'You’re a lifestyle social media expert with a knack for crafting engaging captions that engage audiences on Instagram. Your specialty lies in creating lifestyle, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Business: 'You’re a business social media expert with a knack for crafting professional captions that engage audiences on Instagram. Your specialty lies in creating business, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Technology: 'You’re a technology social media expert with a knack for crafting innovative captions that engage audiences on Instagram. Your specialty lies in creating technology, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Health: 'You’re a health social media expert with a knack for crafting wellness captions that engage audiences on Instagram. Your specialty lies in creating health, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Entertainment: 'You’re an entertainment social media expert with a knack for crafting captivating captions that engage audiences on Instagram. Your specialty lies in creating entertainment, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    News: 'You’re a news social media expert with a knack for crafting timely captions that engage audiences on Instagram. Your specialty lies in creating news, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Personal: 'You’re a personal social media expert with a knack for crafting intimate captions that engage audiences on Instagram. Your specialty lies in creating personal, relatable content that complements images while effectively using relevant hashtags to boost visibility.',
    Adventure: 'You’re an adventure social media expert with a knack for crafting thrilling captions that engage audiences on Instagram. Your specialty lies in creating adventure, relatable content that complements images while effectively using relevant hashtags to boost visibility.'
  };

  const openingStatementSuffix = openingStatements[theme] || openingStatements.Humorous;
  const openingStatement = '';

    // let openingStatementSuffix = 'You’re a witty social media expert with a knack for crafting hilarious captions that engage audiences on Instagram. Your specialty lies in creating funny, relatable content that complements images while effectively using relevant hashtags to boost visibility.';
    // let openingStatement = 'Imagine you are Chandler Bing, the sarcastic and witty character from the TV show Friends.';
    // openingStatement = 'Imagine you are Albus Dumbledore, the wise and enigmatic headmaster of Hogwarts School of Witchcraft and Wizardry.';
    // openingStatement = 'Imagine you aer Snoop Dogg, the iconic rapper and cultural icon.';
    // openingStatement = 'Imagine you are Peter Griffin, the lovable but clueless father from the animated TV show Family Guy.';
    // openingStatement = 'Imagine you are Michael Scott, the bumbling and eccentric regional manager of Dunder Mifflin Paper Company.';
    // openingStatement = 'Imagine you are Jeff Ross, the "Roastmaster General" and king of insult comedy.';

    let content = `${openingStatement} ${openingStatementSuffix}\nYour task is to write a caption for an image who's description is mentioned here: "${message}"
Please ensure that the captions not only bring a smile but also include relevant hashtags to maximize engagement. Keep in mind the tone should be light-hearted and playful, suitable for a wide audience.
Remember to include at least three hashtags that relate to the content of the image. ${caption ? `Do not generate this response: "${caption}"` : ''}. ${context ? `The context is: "${context}"` : ''}`;
    // let content = `You are an AI language model that embodies the persona of the iconic rapper Snoop Dogg.Your task is to respond to questions and prompts using Snoop Dogg's unique vocabulary, style, and cultural references.1.Use a laid-back, cool tone that reflects Snoop Dogg's personality.2.Incorporate slang and colloquialisms typical of Snoop's speech, such as "fo shizzle," "izzle," "homie," and other phrases that resonate with hip-hop culture.3.Reference Snoop Dogg's music, lifestyle, and experiences, ensuring that your responses are infused with elements of his identity as an artist and a cultural figure.4.Maintain a playful, humorous, and friendly demeanor in all interactions, emphasizing positivity and good vibes.5.Structure your responses in a way that mimics Snoop Dogg's rhythm and flow, making them engaging and entertaining while remaining informative.`
    // content = `${message ? `tell me about ${message}` : content}\n`
    for await (const chunk of inference.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "user", content }
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.7
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        out += newContent;
      }  
    }
    return out;
}


const generateCaption = async (imageUrl, theme, context) => {
    try {
        const data = fs.readFileSync(imageUrl);
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
            {
              headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: data,
            }
          );
        
          const result = await response.json();
          const caption = await getAssistantResponse(result[0].generated_text, theme, context);
          return {caption, imageDescription: result[0].generated_text};
      } catch (error) {
        console.error(error);
      }
}

module.exports = {
    getAssistantResponse,
    generateCaption
}

