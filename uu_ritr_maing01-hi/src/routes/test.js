import { Button } from "../bricks/atom/Button.js";

export default function TestPage() {
  return (
    <div>
      <Button type="primary-fill">Primary Fill</Button>
      <Button type="primary-outline">Primary Outline</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="danger">Danger</Button>
      <Button type="fab-primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        Fab Primary
      </Button>
    </div>
  );
}
