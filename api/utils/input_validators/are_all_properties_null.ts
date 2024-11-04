function areAllPropertiesNull(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null) {
      return false;
    }
  }
  return true;
}

export default areAllPropertiesNull;
