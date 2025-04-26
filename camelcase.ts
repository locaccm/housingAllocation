const test_variable = 42;

const testVariable = 42;

const obj = {
  test_property: "erreur",
};

const validObj = {
  testProperty: "valide",
};

interface BadInterface {
  bad_property: string;
}

interface goodInterface {
  goodProperty: string;
}

function bad_function_name() {
  return "erreur";
}

function goodFunctionName() {
  return "valide";
}

export {
  test_variable,
  testVariable,
  obj,
  validObj,
  bad_function_name,
  goodFunctionName,
};
