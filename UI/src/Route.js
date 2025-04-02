import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CampaignProfile from './CampaignProfile';
import FullScreen from './FullScreen';
import PipelineGenerator from './pages/PipelineGenerator';
import PlatformPage from './pages/PipelineGenerator/platform';
import ToolPage from './pages/PipelineGenerator/tool';
import PipelinePage from './pages/PipelineGenerator/pipeline';
import Navigation from './components/Navigation';
import steps from './campaign';
import Homepage from './pages/PipelineGenerator/home';
import MainLayout from './pages/Blog/MainLayout';
import HomePageBlog from './pages/Blog/HomePageBlog';
import SinglePostPage from './pages/Blog/SinglePostPage';
import PostListPage from './pages/Blog/PostListPage';
import Write from './pages/Blog/Write';
import LoginPage from './pages/Blog/LoginPage';
import RegisterPage from './pages/Blog/RegisterPage';
import UserManagement from './pages/Blog/UserManagement';
import AdminRoute from './components/Extension/AdminRoute';
import ForgotPasswordPage from './pages/Blog/ForgotPasswordPage';
import ResetPasswordPage from './pages/Blog/ResetPasswordPage';
import ContributerRoute from './components/Extension/ContributerRoute';
import FlowEditor from './pages/FlowEditor';

const AppRoutes = () => {
    return (
        <Router>
            {/* <Navigation /> */}
            <Routes>
                {/* Redirect root to generate */}
                {/* <Route path="/" element={<Navigate to="/generate" replace />} /> */}
                <Route path="/" element={<Homepage />} />
                <Route path="/generate" element={<PipelineGenerator steps={steps} />} />
                <Route path="/flow-editor" element={<FlowEditor />} />
                
                {/* CRUD Pages */}
                <Route path="/platforms" element={<ContributerRoute><PlatformPage /></ContributerRoute>} />
                <Route path="/tools" element={<ContributerRoute><ToolPage /></ContributerRoute>} />
                <Route path="/pipelines" element={<ContributerRoute><PipelinePage /></ContributerRoute>} />
                <Route path="/blog" element={<MainLayout />}>
                    {/* Trang chủ blog */}
                    <Route index element={<HomePageBlog />} />
                    
                    {/* Route cho danh sách bài viết */}
                    <Route path="posts" element={<PostListPage />} />
                    {/* Route cho bài viết cụ thể */}
                    <Route path=":slug" element={<SinglePostPage />} />
                    
                    {/* Route tạo bài viết mới */}
                    <Route path="write" element={<Write />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="admin" element={ <AdminRoute><UserManagement /></AdminRoute>
                        } />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
