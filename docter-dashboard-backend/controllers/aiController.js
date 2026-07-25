const {
    getHealthRecommendation
} = require("../services/aiService");

const getRecommendation = async (req,res)=>{

try{

const { symptoms } = req.body;

if(!symptoms){

return res.status(400).json({

success:false,

message:"Symptoms are required."

});

}

const result = await getHealthRecommendation(symptoms);

res.status(200).json({

  success: true,

  disease: result.disease,

  recommendation: result.recommendation,

});
}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

module.exports={

getRecommendation

};