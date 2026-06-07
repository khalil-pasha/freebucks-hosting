import axios from 'axios';

export class PterodactylService {
  private static isConfigured(): boolean {
    return !!(process.env.PTERODACTYL_PANEL_URL && process.env.PTERODACTYL_API_KEY);
  }

  private static getAppHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
      'Content-Type': 'application/json',
    };
  }

  private static getClientHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PTERODACTYL_CLIENT_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
      'Content-Type': 'application/json',
    };
  }

  public static async createUser(email: string, username: string, first_name: string, last_name: string, password?: string) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Created user ${username} (${email})`);
      return Math.floor(Math.random() * 10000) + 100;
    }

    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
    const data = {
      email,
      username,
      first_name,
      last_name,
      password: password || undefined
    };

    const response = await axios.post(url, data, { headers: this.getAppHeaders() });
    return response.data.attributes.id as number;
  }

  public static async createServer(name: string, ramGB: number, cpu: number, disk: number, pteroUserId: number) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Created server ${name} with ${ramGB}GB RAM, ${cpu}% CPU, ${disk}GB Disk.`);
      return { 
        id: Math.floor(Math.random() * 10000), 
        identifier: Math.random().toString(36).substring(7) 
      };
    }

    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers`;
    const data = {
      name,
      user: pteroUserId, // Ensure the Ptero user ID exists, usually linked to DB User
      egg: parseInt(process.env.PTERODACTYL_EGG_ID || '1', 10),
      docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
      startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
      environment: {
        SERVER_JARFILE: 'server.jar',
        BUILD_NUMBER: 'latest'
      },
      limits: {
        memory: ramGB * 1024,
        swap: 0,
        disk: disk * 1024,
        io: 500,
        cpu: cpu
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1
      },
      allocation: {
        default: 0 // In prod, usually pass node or let auto-deploy handle
      },
      deploy: {
        locations: [parseInt(process.env.PTERODACTYL_LOCATION_ID || '1', 10)],
        dedicated_ip: false,
        port_range: []
      }
    };

    const response = await axios.post(url, data, { headers: this.getAppHeaders() });
    return {
      id: response.data.attributes.id,
      identifier: response.data.attributes.identifier,
    };
  }

  public static async startServer(identifier: string) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Starting server ${identifier}`);
      return true;
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/power`;
    await axios.post(url, { signal: 'start' }, { headers: this.getClientHeaders() });
    return true;
  }

  public static async stopServer(identifier: string) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Stopping server ${identifier}`);
      return true;
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/power`;
    await axios.post(url, { signal: 'kill' }, { headers: this.getClientHeaders() });
    return true;
  }

  public static async restartServer(identifier: string) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Restarting server ${identifier}`);
      return true;
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/power`;
    await axios.post(url, { signal: 'restart' }, { headers: this.getClientHeaders() });
    return true;
  }

  public static async suspendServer(serverId: number) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Suspending server ID ${serverId}`);
      return true;
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}/suspend`;
    await axios.post(url, {}, { headers: this.getAppHeaders() });
    return true;
  }

  public static async deleteServer(serverId: number) {
    if (!this.isConfigured()) {
      console.log(`[Pterodactyl Sim] Deleting server ID ${serverId}`);
      return true;
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`;
    await axios.delete(url, { headers: this.getAppHeaders() });
    return true;
  }

  public static async checkConnection() {
    if (!this.isConfigured()) {
      return { status: 'simulation_mode' };
    }

    try {
      const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
      await axios.get(url, { headers: this.getAppHeaders() });
      return { status: 'ok' };
    } catch (error: any) {
      console.error('Pterodactyl Check Connection Error:', error.message);
      return { status: 'error', message: error.message };
    }
  }
}
