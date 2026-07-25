// ==========================================
// AI Health Recommendation Service
// ==========================================

const getHealthRecommendation = async (symptoms) => {

  const symptom = symptoms.toLowerCase();

  // ==========================================
  // Fever + Cough
  // ==========================================

  if (
    symptom.includes("fever") &&
    symptom.includes("cough")
  ) {
    return {
      disease: "Common Cold / Viral Infection",
      recommendation:
        "Drink plenty of fluids, take proper rest, use paracetamol for fever if advised, and consult a physician if symptoms continue for more than 2-3 days.",
    };
  }

  // ==========================================
  // Fever
  // ==========================================

  if (symptom.includes("fever")) {
    return {
      disease: "Viral Fever",
      recommendation:
        "Drink plenty of water, take enough rest, eat light food, and consult a physician if fever becomes high or lasts more than 2 days.",
    };
  }

  // ==========================================
  // Headache
  // ==========================================

  if (
    symptom.includes("headache") ||
    symptom.includes("migraine")
  ) {
    return {
      disease: "Migraine / Tension Headache",
      recommendation:
        "Take adequate rest, avoid bright screens, stay hydrated, and consult a neurologist if headaches occur frequently.",
    };
  }

  // ==========================================
  // Stomach Pain
  // ==========================================

  if (
    symptom.includes("stomach") ||
    symptom.includes("abdominal")
  ) {
    return {
      disease: "Gastric Problem",
      recommendation:
        "Eat light food, avoid spicy meals, drink enough water, and consult a gastroenterologist if pain becomes severe.",
    };
  }

  // ==========================================
  // Joint Pain
  // ==========================================

  if (
    symptom.includes("joint") ||
    symptom.includes("joint pain")
  ) {
    return {
      disease: "Arthritis / Joint Inflammation",
      recommendation:
        "Avoid heavy physical activity, take proper rest, apply a cold or warm compress, and consult an orthopedic specialist if pain persists.",
    };
  }

  // ==========================================
  // Back Pain
  // ==========================================

  if (
    symptom.includes("back pain") ||
    symptom.includes("back")
  ) {
    return {
      disease: "Muscle Strain / Back Pain",
      recommendation:
        "Maintain proper posture, avoid lifting heavy weights, perform light stretching, and consult an orthopedic doctor if pain increases.",
    };
  }

  // ==========================================
  // Chest Pain
  // ==========================================

  if (
    symptom.includes("chest") ||
    symptom.includes("chest pain")
  ) {
    return {
      disease: "Possible Heart or Lung Condition",
      recommendation:
        "Chest pain can be serious. Seek immediate medical attention or visit the nearest emergency department.",
    };
  }

  // ==========================================
  // Cough
  // ==========================================

  if (symptom.includes("cough")) {
    return {
      disease: "Seasonal Cough",
      recommendation:
        "Drink warm fluids, avoid cold beverages, and consult a physician if cough lasts more than one week.",
    };
  }

  // ==========================================
  // Sore Throat
  // ==========================================

  if (
    symptom.includes("throat") ||
    symptom.includes("sore throat")
  ) {
    return {
      disease: "Throat Infection",
      recommendation:
        "Gargle with warm salt water, stay hydrated, and consult an ENT specialist if symptoms worsen.",
    };
  }

  // ==========================================
  // Vomiting
  // ==========================================

  if (
    symptom.includes("vomit") ||
    symptom.includes("vomiting")
  ) {
    return {
      disease: "Food Poisoning / Gastric Infection",
      recommendation:
        "Drink ORS, avoid oily food, and consult a doctor if vomiting continues or dehydration develops.",
    };
  }

  // ==========================================
  // Diarrhea
  // ==========================================

  if (
    symptom.includes("diarrhea") ||
    symptom.includes("loose motion")
  ) {
    return {
      disease: "Gastroenteritis",
      recommendation:
        "Drink ORS frequently, stay hydrated, and consult a doctor if symptoms continue.",
    };
  }

  // ==========================================
  // Breathing Problem
  // ==========================================

  if (
    symptom.includes("breathing") ||
    symptom.includes("asthma") ||
    symptom.includes("shortness of breath")
  ) {
    return {
      disease: "Respiratory Problem",
      recommendation:
        "Avoid dust and smoke, use prescribed inhalers if applicable, and consult a pulmonologist immediately.",
    };
  }

  // ==========================================
  // Skin Allergy
  // ==========================================

  if (
    symptom.includes("rash") ||
    symptom.includes("itching") ||
    symptom.includes("allergy")
  ) {
    return {
      disease: "Skin Allergy",
      recommendation:
        "Avoid allergens, keep the affected area clean, and consult a dermatologist if symptoms increase.",
    };
  }

  // ==========================================
  // High Blood Pressure
  // ==========================================

  if (
    symptom.includes("bp") ||
    symptom.includes("blood pressure")
  ) {
    return {
      disease: "High Blood Pressure",
      recommendation:
        "Reduce salt intake, exercise regularly, monitor blood pressure, and consult a physician.",
    };
  }

  // ==========================================
  // Diabetes
  // ==========================================

  if (
    symptom.includes("diabetes") ||
    symptom.includes("sugar")
  ) {
    return {
      disease: "Diabetes",
      recommendation:
        "Monitor blood sugar regularly, avoid sugary foods, maintain a healthy diet, and consult an endocrinologist.",
    };
  }

  // ==========================================
  // Eye Problem
  // ==========================================

  if (
    symptom.includes("eye") ||
    symptom.includes("vision")
  ) {
    return {
      disease: "Eye Infection / Vision Problem",
      recommendation:
        "Avoid rubbing your eyes, keep them clean, and consult an ophthalmologist.",
    };
  }

  // ==========================================
  // Ear Pain
  // ==========================================

  if (
    symptom.includes("ear") ||
    symptom.includes("ear pain")
  ) {
    return {
      disease: "Ear Infection",
      recommendation:
        "Keep your ear dry and consult an ENT specialist for proper examination.",
    };
  }

  // ==========================================
  // Default
  // ==========================================

  return {
    disease: "Unknown Condition",
    recommendation:
      "The entered symptoms do not match any predefined condition. Please consult a qualified doctor for proper diagnosis and treatment.",
  };
};

module.exports = {
  getHealthRecommendation,
};