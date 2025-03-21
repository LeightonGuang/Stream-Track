const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};

export default generateRandomState;
