import ChaincodeService from "../../services/chain.service";

const chaincodeService = new ChaincodeService();

const prepare = async (req, res, next) => {
  const {
    params: { fcn },
    body: args = {}
  } = req;

  if (!fcn) {
    return next("Function not passed");
  }

  const callType = req.originalUrl.includes("invoke");

  try {
    req.request = await chaincodeService.prepareRequest(
      fcn,
      [JSON.stringify(args)],
      callType
    );
    return next();
  } catch (e) {
    return next(e);
  }
};

const query = async (req, res, next) => {
  const { request } = req;

  try {
    const initResult = await chaincodeService.query(request);
    return res.json(initResult);
  } catch (e) {
    return next(e);
  }
};

const invoke = async (req, res, next) => {
  const { request } = req;
  try {
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    return next(e);
  }
};

export default {
  prepare,
  query,
  invoke
};
