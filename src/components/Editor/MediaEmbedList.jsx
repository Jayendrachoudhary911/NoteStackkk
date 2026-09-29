import React from 'react';
import {
  ExternalLink,
  Trash2,
  Paperclip
} from 'lucide-react';

export default function MediaEmbedList({ mediaLinks = [], onRemoveMedia }) {
  if (!mediaLinks || mediaLinks.length === 0) return null;

  return (
    <div style={{ marginTop: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.85 }}>
        <Paperclip size={15} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
          Embedded Media & Resources ({mediaLinks.length})
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mediaLinks.map((item) => {
          const isVideoEmbed = item.type === 'youtube' || item.type === 'vimeo';
          const isDriveEmbed = item.type === 'drive';
          const isSpotifyEmbed = item.type === 'spotify';
          const isNativeVideo =
            item.type === 'video' ||
            item.mimeType?.startsWith('video/') ||
            item.url?.startsWith('data:video/') ||
            item.url?.startsWith('blob:') ||
            /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i.test(item.url || '');
          const isNativeAudio =
            !isNativeVideo &&
            (item.type === 'audio' ||
              item.mimeType?.startsWith('audio/') ||
              item.url?.startsWith('data:audio/') ||
              /\.(mp3|wav|m4a|aac)(\?.*)?$/i.test(item.url || ''));

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--surface-container)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--surface-container-highest)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Media Header */}
              <div
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--surface-container-high)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon || '📎'}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {item.platform}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ns-btn ns-btn-ghost"
                    style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                    title="Open original link"
                  >
                    <ExternalLink size={13} />
                    <span>Open</span>
                  </a>

                  {onRemoveMedia && (
                    <button
                      onClick={() => onRemoveMedia(item.id)}
                      className="ns-btn ns-btn-ghost"
                      style={{ padding: 4, color: '#ef4444' }}
                      title="Remove attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Media Content Player / Embed */}
              <div style={{ padding: 12 }}>
                {isVideoEmbed && (
                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 aspect ratio
                      height: 0,
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>
                )}

                {isDriveEmbed && (
                  <div
                    style={{
                      position: 'relative',
                      height: 380,
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      frameBorder="0"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>
                )}

                {isSpotifyEmbed && (
                  <iframe
                    src={item.embedUrl}
                    title={item.title}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  />
                )}

                {isNativeVideo && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      playsInline
                      style={{
                        width: '100%',
                        maxHeight: 460,
                        display: 'block',
                        outline: 'none',
                      }}
                    >
                      <source src={item.url} type={item.mimeType || 'video/mp4'} />
                      Your browser does not support native video playback.
                    </video>
                  </div>
                )}

                {isNativeAudio && (
                  <audio
                    src={item.url}
                    controls
                    style={{ width: '100%', marginTop: 4 }}
                  />
                )}

                {!isVideoEmbed && !isDriveEmbed && !isSpotifyEmbed && !isNativeVideo && !isNativeAudio && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--surface-container-high)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.url}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="ns-btn ns-btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', flexShrink: 0 }}
                    >
                      <ExternalLink size={13} />
                      <span>Visit Resource</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
