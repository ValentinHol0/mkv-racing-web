import React from 'react';
import { Car, CheckCircle2, Zap, Gauge, RotateCw, Palette, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useCars, useSelectCar, useVerifyChecksum } from '../../hooks/useRacing';
import { carBlockReason, localChecksum } from '../../utils/racing';
import styles from './GaragePage.module.css';

export function GaragePage() {
  const { selectedCarId, selectedLivery, setSelectedCarId, setSelectedLivery } = useAppStore();
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { data: cars, error: carsError, loading } = useCars();
  const selectCar = useSelectCar();
  const verify = useVerifyChecksum();

  if (loading && !cars.length) {
    return <div className={styles.pageWrapper}>Loading fleet catalog...</div>;
  }
  if (carsError) {
    return (
      <div className={styles.pageWrapper}>
        <Alert>{carsError.message}</Alert>
      </div>
    );
  }

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const livery = selectedLivery || selectedCar.liveries[0];
  // Гість бачить усі авто; для пілота перевіряємо, чи ліцензія відкриває клас
  const blockReason = isAuthenticated
    ? carBlockReason(selectedCar, { allowedClasses: user.allowedClasses })
    : null;
  const isRaceCar = user?.selectedCarId === selectedCar.id;
  const verifiedSuccess = verify.data ? verify.data.matched : true;

  const handleVerifyChecksum = () => {
    verify.mutate({ carId: selectedCar.id, checksum: localChecksum(selectedCar) }).catch(() => {});
  };

  const handleSelectForRacing = () => {
    if (!requireAuth()) return;
    selectCar.mutate({ carId: selectedCar.id }).catch(() => {});
  };

  return (
    <div className={styles.pageWrapper} data-testid="garage-page">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeGroup}>
            <Badge variant="tier">STAGE 3 MODS</Badge>
            <Badge variant="online" dot>
              PHYSICS PASSED
            </Badge>
          </div>
          <h1 className={styles.pageTitle}>
            <Car size={24} color="#e63946" />
            VIRTUAL GARAGE & 3D SHOWCASE
          </h1>
          <p className={styles.pageSubtitle}>
            Livery customization, mechanical specs, and SHA-256 cryptographic mod integrity
            verification
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleVerifyChecksum}
          disabled={verify.loading}
        >
          <RotateCw size={14} className={verify.loading ? 'animate-spin' : ''} />
          <span>{verify.loading ? 'Verifying Hashes...' : 'Re-verify SHA-256'}</span>
        </Button>
      </div>

      <div className={styles.layoutGrid}>
        {/* Car Roster Selection Column */}
        <div className={styles.catalogColumn}>
          <h3 className={styles.columnHeading}>Vehicle Fleet Catalog</h3>
          <div className={styles.catalogList}>
            {cars.map((car) => {
              const isSelected = car.id === selectedCar.id;
              return (
                <button
                  key={car.id}
                  onClick={() => {
                    setSelectedCarId(car.id);
                    selectCar.reset();
                    verify.reset();
                  }}
                  className={`${styles.carItem} ${isSelected ? styles.carItemActive : ''}`}
                >
                  <div>
                    <h4 className={styles.carItemTitle}>{car.name}</h4>
                    <span className={styles.carItemSubtitle}>
                      {car.role} • {car.power} • Class {car.carClass}
                      {user?.selectedCarId === car.id ? ' • RACE CAR' : ''}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 size={16} color="#e63946" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Showcase & Specs Stage Column */}
        <div className={styles.stageColumn}>
          {/* 3D WebGL Box Mockup */}
          <div className={styles.stageBox}>
            <div className={styles.stageGridFloor} />
            <div className={styles.stageSpotlight} />

            <div className={styles.stageContent}>
              <div className={styles.carEmblem}>
                <Car size={48} />
              </div>
              <div>
                <span className={styles.stageBadgeTop}>
                  3D WebGL Viewport (AcServer Model Preview)
                </span>
                <h2 className={styles.stageCarName}>{selectedCar.name}</h2>
                <span className={styles.stageLiveryLabel}>
                  Active Livery: <strong className={styles.stageLiveryValue}>{livery}</strong>
                </span>
              </div>
            </div>

            <div className={styles.stageChecksumPos}>
              {verifiedSuccess ? (
                <Badge variant="online" dot>
                  SHA-256 VALIDATED
                </Badge>
              ) : (
                <Badge variant="warning">SHA-256 MISMATCH</Badge>
              )}
            </div>
          </div>

          {/* Livery Selector */}
          <div className={styles.panelCard}>
            <h4 className={styles.panelTitle}>
              <Palette size={16} color="#06b6d4" />
              Livery & Skin Selection
            </h4>
            <div className={styles.liveriesRow}>
              {selectedCar.liveries.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedLivery(item)}
                  className={`${styles.liveryBtn} ${livery === item ? styles.liveryBtnActive : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className={styles.panelCard}>
            <h4 className={styles.panelTitle}>
              <Gauge size={16} color="#e63946" />
              Engineering Specifications
            </h4>
            <div className={styles.specsGrid}>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>POWER OUTPUT</span>
                <span className={styles.specBoxValue}>{selectedCar.power}</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>TORQUE</span>
                <span className={styles.specBoxValue}>{selectedCar.torque}</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>0 - 100 KM/H</span>
                <span className={`${styles.specBoxValue} ${styles.specBoxAccel}`}>
                  {selectedCar.accel}
                </span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>TOP SPEED</span>
                <span className={`${styles.specBoxValue} ${styles.specBoxSpeed}`}>
                  {selectedCar.topSpeed}
                </span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>DRIVETRAIN</span>
                <span className={`${styles.specBoxValue} ${styles.specBoxDrivetrain}`}>
                  {selectedCar.drivetrain}
                </span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specBoxLabel}>CURB WEIGHT</span>
                <span className={styles.specBoxValue}>{selectedCar.weight}</span>
              </div>
            </div>

            {(selectCar.error || verify.error) && (
              <Alert>{(selectCar.error || verify.error).message}</Alert>
            )}
            {selectCar.data && isRaceCar && (
              <Alert variant="success">
                {selectedCar.name} is now your race car for server sessions.
              </Alert>
            )}
            {blockReason && <Alert>{blockReason}</Alert>}

            <div className={styles.panelFooter}>
              <div className={styles.checksumNote}>
                <ShieldCheck size={16} color="#10b981" />
                <span>SHA-256: {selectedCar.sha256.slice(0, 34)}...</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleSelectForRacing}
                disabled={isRaceCar || Boolean(blockReason) || selectCar.loading}
                data-testid="select-car-btn"
              >
                <Zap size={16} />
                <span>
                  {isRaceCar
                    ? 'Selected for Racing'
                    : selectCar.loading
                      ? 'Saving...'
                      : 'Select for Shuto Server'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
