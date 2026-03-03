import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Mail, Phone, MapPin, Calendar, Edit, Award, BookOpen, FlaskConical } from 'lucide-react';
import { TopicChip } from '../components/TopicChip';

export default function Profile() {
  const certificates = [
    { id: 1, title: 'Arduino Fundamentals', date: 'Feb 15, 2026', topic: 'Arduino' as const },
    { id: 2, title: 'IoT Systems Design', date: 'Jan 10, 2026', topic: 'IoT' as const },
    { id: 3, title: 'Raspberry Pi Projects', date: 'Dec 5, 2025', topic: 'Raspberry Pi' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar name="Priya Sharma" size={64} />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="mb-1">Priya Sharma</h1>
                <p className="text-body text-[var(--color-text-secondary)]">Computer Engineering Student</p>
              </div>
              <Button variant="secondary" size="medium">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>priya.sharma@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 text-center">
          <div className="text-[28px] font-bold text-[var(--color-primary)] mb-1">12</div>
          <div className="text-caption text-[var(--color-text-secondary)] flex items-center justify-center gap-1">
            <BookOpen className="w-4 h-4" />
            Courses
          </div>
        </div>
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 text-center">
          <div className="text-[28px] font-bold text-[var(--color-success)] mb-1">18</div>
          <div className="text-caption text-[var(--color-text-secondary)] flex items-center justify-center gap-1">
            <FlaskConical className="w-4 h-4" />
            Labs
          </div>
        </div>
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 text-center">
          <div className="text-[28px] font-bold text-[var(--color-warning)] mb-1">5</div>
          <div className="text-caption text-[var(--color-text-secondary)] flex items-center justify-center gap-1">
            <Award className="w-4 h-4" />
            Certificates
          </div>
        </div>
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-4 text-center">
          <div className="text-[28px] font-bold text-[var(--color-accent)] mb-1">68%</div>
          <div className="text-caption text-[var(--color-text-secondary)]">Progress</div>
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
        <h2 className="mb-6">Certificates</h2>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-[var(--color-warning)] bg-[var(--color-warning)]/5 rounded-[var(--radius-md)]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[var(--color-warning)]/20">
                  <Award className="w-6 h-6 text-[var(--color-warning)]" />
                </div>
                <div>
                  <h3 className="text-body font-medium mb-1">{cert.title}</h3>
                  <div className="flex items-center gap-2">
                    <TopicChip topic={cert.topic} size="small" />
                    <span className="text-caption text-[var(--color-text-secondary)]">
                      Completed on {cert.date}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="small">
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-1 p-6">
        <h2 className="mb-6">Interests</h2>
        <div className="flex flex-wrap gap-2">
          <TopicChip topic="Arduino" />
          <TopicChip topic="IoT" />
          <TopicChip topic="Raspberry Pi" />
          <TopicChip topic="Edge AI" />
          <TopicChip topic="ARM" />
        </div>
      </div>
    </div>
  );
}
