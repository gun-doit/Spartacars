
import axios from "axios";
const DOMAIN = "http://localhost:3000";

export const api = {
  // Command
  getCommand: async (id) => {
    try {
        const result = await axios.get(`${DOMAIN}/api/command/${id}`);
        return result.data;
    } catch ( error ) {
        console.log(error);
        throw new Error("Command 불러오기 실패");
    }
  },

  // Score
  getScore: async (id) => {
    try {
        const result = await axios.get(`${DOMAIN}/api/score/${id}`);
        return result.data;
    } catch ( error ) {
        console.log(error);
        throw new Error("Score 불러오기 실패");
    }
  },

  // Velocity
  getVelocity: async (id) => {
    try{
        const result = await axios.get(`${DOMAIN}/api/velocity/${id}`);
        return result.data;
    } catch (error) {
        console.log(error);
        throw new Error("Velocity 불러오기 실패");
    }
  },

  //ai
  getGenAI: async (narrator) => {
    try{
      const data = {'userPrompt': narrator}
      const result = await axios.post(`${DOMAIN}/api/genai`,data);
      return result.data;
    } catch (error) {
      console.log(error);
      throw new Error("AI 불러오기 실패");
    }
  },
  getGenAI_ready: async () => {
    try{
      const result = await axios.get(`${DOMAIN}/api/genai_ready`);
      return result.data;
    } catch (error) {
      console.log(error);
      throw new Error("AI 불러오기 실패");
    }
  }
};
