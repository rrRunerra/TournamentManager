import { useState } from "react";

export default function CreateModal(
    isOpen,
	onClose,
	onSave
) {
    const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamSize, setTeamSize] = useState("4");

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-background border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
				<div className="p-6">
					<h3 className="text-lg font-medium mb-4">
						{"Create New Theme"}
					</h3>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-1 block">Theme Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="My Custom Theme"
								className="w-full p-2 border rounded bg-background text-foreground"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-1 block">CSS Variables</label>
							<textarea
								
						
								placeholder={`.my-theme {\n  --primary: #6b46c1;\n  ...\n}`}
								className="w-full h-60 font-mono text-sm p-2 border rounded bg-background text-foreground"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Start with <code>.your-theme-name {'{'}</code>
							</p>
						</div>
					</div>

					<div className="flex justify-end gap-2 mt-6">
						{/* <Button variant="outline" onClick={onClose}>Cancel</Button>
						<Button onClick={handleSave}>Save</Button> */}
					</div>
				</div>
			</div>
		</div>
  )


}