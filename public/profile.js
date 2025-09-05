// Profile page functionality for EnviConnect
class ProfileManager {
  constructor() {
    this.currentUserId = null;
    this.activityChart = null;
    this.init();
  }

  init() {
    // Get user ID from session storage
    this.currentUserId = sessionStorage.getItem('userId');
    
    if (!this.currentUserId) {
      // Try to get from localStorage as fallback
      this.currentUserId = localStorage.getItem('userId');
    }
    
    if (!this.currentUserId) {
      console.warn('No user ID found, using demo mode');
      // Use demo mode for testing
      this.loadDemoData();
      return;
    }
    
    this.loadProfileData();
  }

  loadDemoData() {
    // Demo data for testing the profile page
    const demoData = {
      user: {
        id: 'demo-user-id',
        username: 'eco_warrior',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@enviconnect.com',
        bio: 'Passionate environmental activist working towards a sustainable future. I love working on renewable energy projects and organizing tree plantation drives in my community.',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2e7d32&color=ffffff&size=150',
        location: 'San Francisco, California',
        age: 28,
        designation: 'Environmental Engineer',
        joinedAt: '2024-01-15T00:00:00.000Z'
      },
      stats: {
        projectsCreated: 12,
        projectsJoined: 8,
        contributions: 45,
        followers: 127
      },
      createdProjects: [
        {
          name: 'Green City Initiative',
          brief: 'Large-scale tree plantation project to increase urban green cover and improve air quality in metropolitan areas.',
          theme: 'Tree Plantation',
          volunteers: 45,
          volunteerGoal: 100,
          createdAt: '2024-11-01T00:00:00.000Z'
        },
        {
          name: 'Solar Panel Community Project',
          brief: 'Installing solar panels in community centers to promote renewable energy adoption and reduce carbon footprint.',
          theme: 'Renewable Energy',
          volunteers: 23,
          volunteerGoal: 50,
          createdAt: '2024-10-15T00:00:00.000Z'
        },
        {
          name: 'Ocean Cleanup Drive',
          brief: 'Organized beach cleanup and ocean waste removal to protect marine ecosystems and promote environmental awareness.',
          theme: 'Waste Management',
          volunteers: 78,
          volunteerGoal: 80,
          createdAt: '2024-09-20T00:00:00.000Z'
        }
      ],
      monthlyStats: [
        { month: 1, projects: 1 },
        { month: 2, projects: 2 },
        { month: 3, projects: 1 },
        { month: 4, projects: 3 },
        { month: 5, projects: 2 },
        { month: 6, projects: 1 },
        { month: 7, projects: 0 },
        { month: 8, projects: 1 },
        { month: 9, projects: 1 },
        { month: 10, projects: 1 },
        { month: 11, projects: 1 },
        { month: 12, projects: 0 }
      ],
      categoryStats: {
        'Tree Plantation': 4,
        'Renewable Energy': 3,
        'Waste Management': 2,
        'Water Conservation': 2,
        'Awareness Campaign': 1
      }
    };
    
    console.log('Loading demo profile data...');
    this.updateProfileUI(demoData);
    this.createActivityChart(demoData.monthlyStats);
  }

  async loadProfileData() {
    try {
      const response = await fetch(`/api/users/${this.currentUserId}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.updateProfileUI(data);
      this.createActivityChart(data.monthlyStats);
      
    } catch (error) {
      console.error('Error loading profile:', error);
      this.showError('Failed to load profile data. Please try again.');
    }
  }

  updateProfileUI(data) {
    const { user, stats, createdProjects, categoryStats } = data;
    
    // Update profile info
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    document.getElementById('profileName').textContent = fullName || user.username;
    document.getElementById('profileBio').textContent = user.bio || 'Environmental enthusiast making a difference.';
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLocation').textContent = user.location || `${user.city || ''}, ${user.state || ''}`.replace(', ,', '').replace(/^,|,$/, '') || 'Location not specified';
    document.getElementById('profileDesignation').textContent = user.designation || 'Environmental Enthusiast';
    
    // Update avatar
    const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=2e7d32&color=ffffff&size=150`;
    document.getElementById('profileAvatar').src = avatarUrl;
    document.getElementById('topbarAvatar').src = avatarUrl;
    
    // Update topbar username
    document.getElementById('topbarUsername').textContent = user.username;
    
    // Update join date
    const joinDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('joinDate').textContent = `Joined ${joinDate}`;
    
    // Update stats
    document.getElementById('projectsCreated').textContent = stats.projectsCreated || 0;
    document.getElementById('projectsJoined').textContent = stats.projectsJoined || 0;
    document.getElementById('contributions').textContent = stats.contributions || 0;
    
    // Update engagement stats
    document.getElementById('categoriesCount').textContent = Object.keys(categoryStats).length || 0;
    document.getElementById('followersCount').textContent = stats.followers || 0;
    
    // Calculate total engagement
    const totalEngagement = (stats.projectsCreated || 0) * 15 + (stats.contributions || 0) * 3;
    document.getElementById('totalEngagement').textContent = totalEngagement;
    
    // Update recent projects
    this.updateRecentProjects(createdProjects);
  }

  createActivityChart(monthlyStats) {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    if (this.activityChart) {
      this.activityChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.activityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Projects Created',
          data: monthlyStats ? monthlyStats.map(stat => stat.projects) : new Array(12).fill(0),
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2e7d32',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(46, 125, 50, 0.1)'
            },
            ticks: {
              color: '#4b604b',
              font: {
                family: 'Poppins'
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#4b604b',
              font: {
                family: 'Poppins'
              }
            }
          }
        }
      }
    });
  }

  updateRecentProjects(projects) {
    const container = document.getElementById('recentProjects');
    
    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: #4b604b; padding: 20px;">
          <i class="fas fa-project-diagram" style="font-size: 2rem; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No projects created yet</p>
          <a href="project.html" style="color: #2e7d32; text-decoration: none; font-weight: 600;">Create your first project</a>
        </div>
      `;
      return;
    }
    
    const recentProjects = projects.slice(0, 3);
    container.innerHTML = recentProjects.map(project => `
      <div style="background: #f8fcf8; padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #2e7d32; transition: transform 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
        <h4 style="color: #234d20; margin-bottom: 8px; font-size: 1rem; font-weight: 600;">${project.name}</h4>
        <p style="color: #4b604b; font-size: 0.85rem; margin-bottom: 12px; line-height: 1.4;">${project.brief.substring(0, 100)}${project.brief.length > 100 ? '...' : ''}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span style="background: linear-gradient(135deg, #2e7d32, #4caf50); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${project.theme}</span>
          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.8rem; color: #4b604b;">
            <span><i class="fas fa-users" style="margin-right: 4px;"></i>${project.volunteers}/${project.volunteerGoal}</span>
            <span>${new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  async editProfile() {
    const currentBio = document.getElementById('profileBio').textContent;
    const newBio = prompt('Enter your bio:', currentBio);
    
    if (newBio !== null && newBio.trim() !== '' && newBio.trim() !== currentBio) {
      try {
        await this.updateProfile({ bio: newBio.trim() });
        this.showSuccess('Bio updated successfully!');
      } catch (error) {
        this.showError('Failed to update bio');
      }
    }
  }

  async updateProfile(updates) {
    const response = await fetch(`/api/users/${this.currentUserId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    // Reload profile data
    await this.loadProfileData();
  }

  openSettings() {
    // Enhanced settings functionality
    const settingsOptions = [
      'Change Avatar',
      'Update Location', 
      'Edit Designation',
      'Privacy Settings',
      'Notification Preferences'
    ];
    
    const choice = prompt(`Settings:\n${settingsOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEnter option number (1-${settingsOptions.length}):`);
    
    if (choice && choice >= 1 && choice <= settingsOptions.length) {
      switch(parseInt(choice)) {
        case 1:
          this.changeAvatar();
          break;
        case 2:
          this.updateLocation();
          break;
        case 3:
          this.updateDesignation();
          break;
        default:
          this.showInfo('Feature coming soon!');
      }
    }
  }

  async changeAvatar() {
    const newAvatar = prompt('Enter avatar URL:');
    if (newAvatar && newAvatar.trim()) {
      try {
        await this.updateProfile({ avatar: newAvatar.trim() });
        this.showSuccess('Avatar updated successfully!');
      } catch (error) {
        this.showError('Failed to update avatar');
      }
    }
  }

  async updateLocation() {
    const newLocation = prompt('Enter your location:');
    if (newLocation && newLocation.trim()) {
      try {
        await this.updateProfile({ location: newLocation.trim() });
        this.showSuccess('Location updated successfully!');
      } catch (error) {
        this.showError('Failed to update location');
      }
    }
  }

  async updateDesignation() {
    const newDesignation = prompt('Enter your designation/title:');
    if (newDesignation && newDesignation.trim()) {
      try {
        await this.updateProfile({ designation: newDesignation.trim() });
        this.showSuccess('Designation updated successfully!');
      } catch (error) {
        this.showError('Failed to update designation');
      }
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = 'login.html';
    }
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showInfo(message) {
    this.showNotification(message, 'info');
  }

  showNotification(message, type = 'info') {
    const colors = {
      error: '#f44336',
      success: '#4caf50',
      info: '#2196f3'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: Poppins, sans-serif;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Global functions for backward compatibility
let profileManager;

function editProfile() {
  profileManager.editProfile();
}

function openSettings() {
  profileManager.openSettings();
}

function logout() {
  profileManager.logout();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  profileManager = new ProfileManager();
});

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
