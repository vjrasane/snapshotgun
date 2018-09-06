const ARG_MATCHER = /^--[^-].*$/;
const ALIAS_MATCHER = /^-[^-].*$/;

const parseArgs = args => {
  const parsed = {};

  const createArg = () => {
    if (currentArg in parsed) {
      throw Error("Duplicate argument '" + currentArg + "'");
    }

    if (!buffer.length) {
      parsed[currentArg] = true;
    } else if (buffer.length === 1) {
      parsed[currentArg] = buffer[0];
    } else {
      parsed[currentArg] = [...buffer];
    }
    buffer = [];
  };

  let buffer = [];
  let currentArg;
  args.forEach(arg => {
    let argName;
    if (ARG_MATCHER.test(arg)) {
      argName = arg.substring(2);
      if (argName.length < 2) {
        throw Error("Invalid argument: Argument '" + arg + "' name too short ");
      }
    } else if (ALIAS_MATCHER.test(arg)) {
      argName = arg.substring(1);
      if (argName.length !== 1) {
        throw Error(
          "Invalid argument: Argument alias '" +
            arg +
            "' must be exactly one character."
        );
      }
    } else if (!currentArg) {
      throw Error("Missing argument for value: '" + arg + "'");
    }

    if (!argName) {
      buffer.push(arg);
    } else {
      if (currentArg) {
        createArg();
      }
      currentArg = argName;
    }
  });

  if (currentArg || buffer.length) {
    createArg();
  }

  return parsed;
};

export default parseArgs;
