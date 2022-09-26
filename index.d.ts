export default class kiloviewNDI {
    public connection_info: {
        ip: string;
        username: string;
        password: string;
    };

    public session: {
        token: string;
        session: string;
    };

    constructor(ip: string, username: string, password: string, timeout?: number);

    private authorize(): Promise<true>;
    private authPost(...args: any[]): Promise<any>;

    modeGet(): Promise<any>;
    modeSwitch(mode: "encoder" | "decoder"): Promise<any>;
    modeStatus(): Promise<"encoder" | "decoder">;
    decoderDiscoveryGet(): Promise<any>;
    decoderCurrentStatus(): Promise<{
        audio_sampling: number,
        audio_format: string,
        ip: string,
        codec: string,
        url: string,
        resolution: string,
        inst_frame_rate: number,
        audio_channels: number,
        online: boolean,
        web: string,
        ptz: number,
        xRes: number,
        warning: string,
        bitrate: number,
        frame_rate: number,
        video_mode: string,
        de_interlace: boolean,
        interlaced: boolean,
        name: string,
        yRes: number
    }>;
    decoderCurrentSetPreset(id: string): Promise<any>;
    decoderCurrentSetUrl(name: string, url: string): Promise<any>;
    /**
     * Set blank screen with custom color
     * @param color #rrggbb
     */
        decoderPresetSetBlank(color: string): Promise<any>;
        encoderNdiStatus(): Promise<any>;
        encoderNdiGetConfig(): Promise<any>;
        encoderNdiSetConfig(config: {
        device_group?: string;
        device_name?: string;
        ndi_connection?: "tcp" | "multicast";
        netprefx?: string;
        quality?: number;
    }): Promise<any>;
    sysServerInfo(): Promise<any>;
    sysReconnect(): Promise<any>;
    sysReboot(): Promise<any>;
    sysRestore(): Promise<any>;
}