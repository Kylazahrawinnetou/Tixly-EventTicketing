import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeResult } from 'html5-qrcode';
import { db } from '../services/firebase';
import { Ticket, Event, TicketStatus } from '../types';

type ScanResult = 'success' | 'error' | 'warning' | 'info';

const ResultDisplay: React.FC<{ status: ScanResult; message: string; ticket?: Ticket & { eventName?: string } }> = ({ status, message, ticket }) => {
    
    useEffect(() => {
        // @ts-ignore
        window.lucide?.createIcons();
    });

    const statusConfig = {
        success: {
            bgColor: 'bg-green-500/10 border-green-500/50 text-green-400',
            icon: 'check-circle'
        },
        error: {
            bgColor: 'bg-red-500/10 border-red-500/50 text-red-400',
            icon: 'x-circle'
        },
        warning: {
            bgColor: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400',
            icon: 'alert-triangle'
        },
        info: {
            bgColor: 'bg-blue-500/10 border-blue-500/50 text-blue-400',
            icon: 'info'
        }
    }[status];

    return (
        <div className={`p-6 rounded-lg text-left border ${statusConfig.bgColor}`}>
            <div className="flex items-center mb-4">
                 <i data-lucide={statusConfig.icon} className="h-8 w-8 mr-4"></i>
                <p className="text-xl font-bold">{message}</p>
            </div>
            {ticket && (
                <div className="text-sm space-y-2 text-foreground/80 border-t border-border/50 pt-4 mt-4">
                    <p><strong>Event:</strong> {ticket.eventName}</p>
                    <p><strong>Participant:</strong> {ticket.namaPeserta}</p>
                    <p><strong>Status:</strong> <span className="font-semibold">{ticket.status.toUpperCase()}</span></p>
                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                </div>
            )}
        </div>
    );
}


const OrganizerCheckin: React.FC = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [validationStatus, setValidationStatus] = useState<ScanResult | null>(null);
    const [validationMessage, setValidationMessage] = useState<string>('Scan a QR code to begin.');
    const [validatedTicket, setValidatedTicket] = useState<(Ticket & { eventName?: string }) | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const onScanSuccess = (decodedText: string, result: Html5QrcodeResult) => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Error clearing scanner", err));
        }
        setIsScanning(false);
        setScanResult(decodedText);
        validateTicket(decodedText);
    };

    const onScanFailure = (error: any) => {};

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
             const scanner = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error('Failed to clear html5QrcodeScanner.', error);
                });
                 scannerRef.current = null;
            }
        };
    }, [isScanning]);


    const validateTicket = async (ticketId: string) => {
        setValidationMessage('Validating...');
        setValidationStatus('info');
        setValidatedTicket(null);

        try {
            const ticketRef = db.collection('tickets').doc(ticketId);
            const ticketSnap = await ticketRef.get();

            if (!ticketSnap.exists) {
                setValidationStatus('error');
                setValidationMessage('Ticket Not Valid');
                return;
            }

            const ticketData = { id: ticketSnap.id, ...ticketSnap.data() } as Ticket;

            const eventRef = db.collection('events').doc(ticketData.eventId);
            const eventSnap = await eventRef.get();
            const eventName = eventSnap.exists ? (eventSnap.data() as Event).namaAcara : "Unknown Event";

            setValidatedTicket({ ...ticketData, eventName });

            if (ticketData.status === 'used') {
                setValidationStatus('warning');
                setValidationMessage('Ticket Already Used');
            } else if (ticketData.status === 'paid') {
                await ticketRef.update({ status: 'used' });
                setValidatedTicket(prev => prev ? { ...prev, status: 'used' as TicketStatus } : null);
                setValidationStatus('success');
                setValidationMessage('Valid! Participant Checked In.');
            } else {
                setValidationStatus('error');
                setValidationMessage(`Ticket Status is ${ticketData.status}. Cannot check in.`);
            }

        } catch (error) {
            console.error("Error validating ticket: ", error);
            setValidationStatus('error');
            setValidationMessage('An error occurred during validation.');
        }
    };
    
    const handleScanAgain = () => {
        setScanResult(null);
        setValidationStatus(null);
        setValidationMessage('Scan a QR code to begin.');
        setValidatedTicket(null);
        setIsScanning(true);
    };


    return (
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Ticket Check-In</h1>
            <div className="max-w-xl mx-auto bg-card border border-border p-6 rounded-lg shadow-sm">
                {isScanning && (
                  <div id="qr-reader" className="w-full bg-card rounded-lg overflow-hidden [&>span]:hidden [&>div]:border-0"></div>
                )}
                
                {!isScanning && (
                     <div className="space-y-6">
                        {validationStatus && <ResultDisplay status={validationStatus} message={validationMessage} ticket={validatedTicket || undefined} />}
                        <button
                            onClick={handleScanAgain}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors text-lg"
                        >
                            Scan Another Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerCheckin;
