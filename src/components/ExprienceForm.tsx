"use client";

import { TimelineForm, type TimelineFormProps } from "./editor/TimelineForm";

/** Add / edit an Experience entry. */
export default function ExprienceForm(props: TimelineFormProps) {
  return <TimelineForm kind="experience" {...props} />;
}
