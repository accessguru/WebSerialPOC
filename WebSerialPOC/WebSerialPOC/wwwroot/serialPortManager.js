class SerialPortManager {
    constructor() {
        this.port = null;
        this.writer = null;
        this.writableStreamClosed = null;
    }

    async openPort() {
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 9600 });

            const encoder = new TextEncoderStream();
            this.writer = encoder.writable.getWriter();
            this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable);

            return "Port opened successfully";
        } catch (error) {
            return `Failed to open port: ${error}`;
        }
    }

    async openCashDrawer() {
        const data = new TextEncoder().encode("OPEN");
        return await this.sendData(data);
    }

    async sendData(data) {
        if (this.writer) {
            try {
                await this.writer.write(data);
                return `Data sent successfully: ${data}`;
            } catch (error) {
                return `Failed to send data: ${error}`;
            }
        } else {
            return "Port is not open";
        }
    }

    async closePort() {
        if (this.port && this.port.readable && this.port.writable) {
            try {
                this.writer.close();
                await this.writableStreamClosed;
                await this.port.close();

                return "Port closed successfully";
            } catch (error) {
                return `Failed to close port:${error}`;
            }
        } else {
            return "Port is already closed or not open";
        }
    }
}

window.serialPortManager = new SerialPortManager();