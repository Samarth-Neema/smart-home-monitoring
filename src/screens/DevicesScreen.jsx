import { useEffect, useRef, useState } from 'react';
import {
  Wifi,
  BatteryMedium,
  Signal,
  RefreshCw,
  Clock,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import Modal from '../components/Modal';

const RESTART_DURATION_MS = 2000;

export default function DevicesScreen({ scenario, device, onRestart }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartDone, setRestartDone] = useState(false);
  const [lastRestart, setLastRestart] = useState(device.lastRestart);

  useEffect(() => {
    return () => clearTimeout(restartTimerRef.current);
  }, []);

  const restartTimerRef = useRef(null);

  function handleRestart() {
    setConfirmOpen(false);
    setRestarting(true);
    setRestartDone(false);
    // Simulated restart only — no real device is touched.
    restartTimerRef.current = setTimeout(() => {
      setRestarting(false);
      setRestartDone(true);
      setLastRestart('Just now');
      onRestart();
    }, RESTART_DURATION_MS);
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="device-header">
          <div>
            <h2>{device.name}</h2>
            <p className="section-sub">Your only registered smart home hub.</p>
          </div>
          <span className={`badge ${scenario.connected ? 'tone-ok' : 'tone-critical'}`}>
            <Wifi size={13} />
            {scenario.connected ? 'Connected' : 'Offline'}
          </span>
        </div>

        <dl className="device-details">
          <div className="detail-item">
            <dt><Wifi size={15} /> Connection status</dt>
            <dd>{scenario.connected ? 'Connected' : 'Offline'}</dd>
          </div>
          <div className="detail-item">
            <dt><BatteryMedium size={15} /> Battery</dt>
            <dd className={scenario.battery < 20 ? 'text-warning' : ''}>{scenario.battery}%</dd>
          </div>
          <div className="detail-item">
            <dt><Signal size={15} /> Network strength</dt>
            <dd>{device.networkStrength}</dd>
          </div>
          <div className="detail-item">
            <dt><RefreshCw size={15} /> Software version</dt>
            <dd>{device.softwareVersion}</dd>
          </div>
          <div className="detail-item">
            <dt><Clock size={15} /> Last sync</dt>
            <dd>{scenario.lastSync}</dd>
          </div>
          <div className="detail-item">
            <dt><RotateCcw size={15} /> Last restart</dt>
            <dd>{lastRestart}</dd>
          </div>
        </dl>

        {!scenario.connected && (
          <div className="offline-note">
            Restart is disabled because the hub is offline. Bring it back online
            by checking its power and network connection first.
          </div>
        )}

        <button
          className="btn btn-primary"
          disabled={!scenario.connected || restarting}
          onClick={() => setConfirmOpen(true)}
        >
          {restarting ? (
            <>
              <Loader2 size={15} className="spin" />
              Restarting…
            </>
          ) : (
            <>
              <RotateCcw size={15} />
              Restart Device
            </>
          )}
        </button>

        {restarting && (
          <p className="restart-status" role="status">
            Restarting Home Hub. This is a simulation — it takes a couple of seconds.
          </p>
        )}
        {restartDone && (
          <p className="restart-status restart-success" role="status">
            <CheckCircle2 size={15} />
            Restart completed (simulated). Last restart updated to &ldquo;Just now&rdquo;.
          </p>
        )}
      </div>

      {confirmOpen && (
        <Modal title="Restart Home Hub?" onClose={() => setConfirmOpen(false)}>
          <p>
            Restarting will temporarily interrupt the device&apos;s operation for a
            short while. During the restart the hub will not report events.
          </p>
          <p className="modal-note">
            This is a simulated demo action — no real physical device will be restarted.
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRestart}>
              Restart Device
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
