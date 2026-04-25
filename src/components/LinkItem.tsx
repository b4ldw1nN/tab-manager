export interface LinkType {
  id: string;
  title: string;
  url: string;
  addedAt: string;
}

interface Props {
  link: LinkType;
  onDelete: (id: string) => void;
}

export function LinkItem({ link, onDelete }: Props) {
  return (
    <div className="link-item">
      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
      <button onClick={() => onDelete(link.id)} aria-label="Delete">Delete</button>
    </div>
  );
}
