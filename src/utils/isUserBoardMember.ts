// Helper function to check if a user is a member of a board
import Board from "../models/board.model";

const isUserBoardMember = async (boardId: string, userId: string) => {
  const board = await Board.findOne({ _id: boardId, members: userId });
  console.log("board", board);
  return !!board;
};

export { isUserBoardMember };
