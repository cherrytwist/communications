import React from "react";
import styled from "styled-components";

const ReplyContainer = styled.div`
  display: flex;
  padding: 8px;
  flex-direction: column;
  flex-grow: 1;
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid darkslategrey;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: "palevioletred";
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

export interface ReplyViewProps {
  actions: {
    onReply: (message: string) => void;
  };
}

export default function ReplyView({ actions }: ReplyViewProps) {
  return (
    <ReplyContainer>
      <Input onKeyUp={(e) => actions.onReply(e.currentTarget.value)} />
    </ReplyContainer>
  );
}