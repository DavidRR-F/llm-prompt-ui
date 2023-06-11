import { connectToDB } from "@utlis/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const prompts = await Prompt.find({ creator: params.id }).populate(
      "creator"
    );
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
