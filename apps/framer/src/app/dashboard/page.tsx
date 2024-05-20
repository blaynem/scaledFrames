import { ProjectsPanel } from './ProjectsPanel';

export const metadata = {
  title: 'Dashboard',
  description: 'Projects and Teams Overview',
};

export default function Dashboard() {
  return (
    <div>
      <ProjectsPanel />
    </div>
  );
}
