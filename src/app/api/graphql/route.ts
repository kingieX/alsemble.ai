import { serverClient } from "@/lib/server/serverClient";
// import { gql } from "@apollo/client";
import { parse } from "graphql";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
  const { query, variables } = await request.json();

  console.log("Incoming Query:", query);
  console.log("Incoming Variables:", JSON.stringify(variables, null, 2));

  try {
    const isMutation = query.trim().startsWith("mutation");
    const result = isMutation
      ? await serverClient.mutate({
          mutation: parse(query),
          variables,
        })
      : await serverClient.query({
          query: parse(query),
          variables,
        });

    console.log("GraphQL Result:", result);

    if (!result || !result.data) {
      console.error("No data returned from the GraphQL server.");
      return NextResponse.json(
        { error: "No data returned from the GraphQL server." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ data: result.data }, { headers: corsHeaders });
  } catch (error) {
    console.error("GraphQL Execution Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
