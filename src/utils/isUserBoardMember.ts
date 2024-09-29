// Helper function to check if a user is a member of a board
import Board from "../models/board.model";
import { IBoard } from "src/types/boardInterface";

const isUserBoardMember = async (boardId: string, userId: string) => {
  const board = (await Board.findOne({
    _id: boardId,
    members: userId,
  })) as IBoard;
  console.log("board", board);
  return !!board;
};

export { isUserBoardMember };
