const util = {
  getObjectFromString: (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return false;
    }
  }
};

export default util;
