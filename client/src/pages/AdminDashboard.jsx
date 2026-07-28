import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, Activity, Trash2, Search, Download, Shield } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  
  const [userSearch, setUserSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');

  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'reports'

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchReports();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const { data } = await api.get('/admin/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async (search = '') => {
    try {
      setLoadingUsers(true);
      const { data } = await api.get(`/admin/users?search=${search}`);
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchReports = async (search = '') => {
    try {
      setLoadingReports(true);
      const { data } = await api.get(`/admin/reports?search=${search}`);
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoadingReports(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their reports? This action cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      if (data.success) {
        toast.success('User deleted successfully');
        fetchUsers(userSearch);
        fetchStats(); // Update stats
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;
    try {
      const { data } = await api.delete(`/admin/reports/${id}`);
      if (data.success) {
        toast.success('Report deleted successfully');
        fetchReports(reportSearch);
        fetchStats(); // Update stats
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleUserSearch = (e) => {
    e.preventDefault();
    fetchUsers(userSearch);
  };

  const handleReportSearch = (e) => {
    e.preventDefault();
    fetchReports(reportSearch);
  };

  const handleDownloadPDF = async (id, domain) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-download' });
      const response = await api.get(`/resume/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_Analysis_${domain || 'Report'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('PDF Downloaded!', { id: 'pdf-download' });
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf-download' });
    }
  };

  if (loadingStats) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-brand-500" />
          Admin Portal
        </h1>
        <p className="mt-2 text-slate-400">
          Manage system users and view global analysis statistics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-brand-500" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Reports</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats?.totalReports || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-sky-400" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Daily Uploads</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats?.dailyUploads || 0}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
            <Activity className="h-6 w-6 text-fuchsia-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Users className="h-4 w-4" />
            Users Management
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            Reports Management
          </button>
        </nav>
      </div>

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <form onSubmit={handleUserSearch} className="flex gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {loadingUsers ? (
            <Loader fullScreen={false} />
          ) : users.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
              No users found matching your criteria.
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-transparent">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-500/20 text-brand-300 font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{u.name}</div>
                              <div className="text-sm text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-slate-500/20 text-slate-300'
                          }`}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {u.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="h-5 w-5 inline-block" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reports Tab Content */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <form onSubmit={handleReportSearch} className="flex gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search by user email or domain..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {loadingReports ? (
            <Loader fullScreen={false} />
          ) : reports.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
              No reports found matching your criteria.
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Domain</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-transparent">
                    {reports.map((r) => (
                      <tr key={r._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{r.user?.name || 'Unknown User'}</div>
                          <div className="text-sm text-slate-400">{r.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {r.domain || 'General'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            r.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
                            r.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {r.overallScore || 0}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                          <button
                            onClick={() => handleDownloadPDF(r._id, r.domain)}
                            className="text-brand-400 hover:text-brand-300 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="h-5 w-5 inline-block" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(r._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="h-5 w-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
