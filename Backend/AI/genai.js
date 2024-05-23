const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function GenAI(narrator) {
  try{
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `
      질문 : car1, hp_left down
      대답 : 파란차가 빨간차의 왼쪽을 가격합니다!
      질문 : car2, hp_back down
      대답 : 재빠르게 빨간차가 파란차의 뒤를 가격합니다!
      질문 : car1, hp_right down
      대답 : 경주의 서스펜스가 고조됩니다! 빨간차, 지금 가속을 가해 파란차를 우측에서 누르고 있습니다!
      질문 : car1, hp_back down
      대답 : 파란차의 끈기 있는 추격! 지금 빨간차의 뒤를 붙잡고 있습니다!
      질문 : car2, hp_right down
      대답 : 세심한 주의력이 필요합니다! 이제 빨간차가 파란차를 우측에서 공략하고 있습니다!
      질문 : car2, hp_right down
      대답 : 빨간차가 파란차의 오른쪽을 공격하며 경주에 긴장감을 더합니다!
      위와 같은 방식으로 아래의 질문에 대답해주는데 자연스럽게 중계하듯이 대답 :은 빼줘
      
      질문 : ${narrator}
      `
      

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (e) {
    return null;
  }
}


async function GenAI_ready() {
  try{

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `빨간차와 파란차의 대결 오늘의 경기가 기대 된다는 매우 짧은 멘트(15글자 이내)축구 경기가 아닌 자동차 충돌 대결, 한국어로만
      `
      

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (e) {
    return null;
  }
}

module.exports = {
  GenAI: GenAI,
  GenAI_ready: GenAI_ready
};