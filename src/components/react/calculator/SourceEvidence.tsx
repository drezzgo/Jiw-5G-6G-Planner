import type {
  EvidenceReference,
} from '../../../knowledge/evidence-registry';

function typeLabel(type: EvidenceReference['type']) {
  switch (type) {
    case 'STANDARD':
      return 'Estándar técnico';
    case 'REGULATION':
      return 'Normativa colombiana';
    default:
      return 'Referencia';
  }
}

export default function SourceEvidence({
  items,
}: {
  items: EvidenceReference[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <details className="evidence-box">
      <summary>
        Ver respaldo documental ({items.length})
      </summary>

      <div className="evidence-list">
        {items.map((item) => (
          <article
            className="evidence-item"
            key={item.id}
          >
            <header>
              <span className={`evidence-badge evidence-badge--${item.type.toLowerCase()}`}>
                {typeLabel(item.type)}
              </span>
              <strong>{item.authority}</strong>
            </header>

            <p className="evidence-document">
              {item.document}
            </p>

            <dl>
              <div>
                <dt>Ubicación exacta</dt>
                <dd>{item.locator}</dd>
              </div>
              <div>
                <dt>Extracto breve</dt>
                <dd className="evidence-quote">
                  {item.excerpt}
                </dd>
              </div>
              <div>
                <dt>Qué respalda</dt>
                <dd>{item.supports}</dd>
              </div>
              <div>
                <dt>Alcance</dt>
                <dd>{item.scopeNote}</dd>
              </div>
            </dl>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              Abrir documento oficial ↗
            </a>
          </article>
        ))}
      </div>
    </details>
  );
}
