"use client";

import { TimelineForm, type TimelineFormProps } from "./editor/TimelineForm";

/** Add / edit an Education entry. */
export default function EducationForm(props: TimelineFormProps) {
  return <TimelineForm kind="education" {...props} />;
}
