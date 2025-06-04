import History from "../models/history.model.js";
import catchAsync from "../utils/catchAsync.js";

export const getHistory = catchAsync(async (req, res, next) => {
  const history = await History.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    status: "success",
    data: {
      history,
    },
  });
});

export const deleteHistory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await History.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const deleteAllHistory = catchAsync(async (req, res, next) => {
  await History.deleteMany({ userId: req.user._id });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
